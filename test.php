<?php
/**
 * Casa Pronto React SPA Theme Router
 */

$request_uri = $_SERVER['REQUEST_URI'];
$parsed_url = parse_url($request_uri);
$path = $parsed_url['path'];

$theme_dir = get_template_directory();
$theme_uri = get_template_directory_uri();

// 1. ASSET INTERCEPTION & REDIRECTION
if (
    strpos($path, '/assets/') === 0 || 
    strpos($path, '/prerender-') === 0 || 
    $path === '/vite.svg'
) {
    wp_redirect($theme_uri . $path, 301);
    exit;
}

// 2. SSG HTML ROUTING
$clean_path = rtrim($path, '/');
$ssg_file = $theme_dir . $clean_path . '/index.html';

if ($clean_path === '') {
    $ssg_file = $theme_dir . '/index.html';
}

// 3. SERVE PRERENDERED HTML
if (file_exists($ssg_file)) {
    echo file_get_contents($ssg_file);
    exit;
}

// 4. DYNAMIC ROUTE FALLBACK
$fallback_file = $theme_dir . '/index.html';
if (file_exists($fallback_file)) {
    $html = file_get_contents($fallback_file);
    
    // Inject dynamic SEO tags for property pages to allow Googlebot to index them immediately
    $current_path = $_SERVER['REQUEST_URI'];
    if (preg_match('#/proprietate/(\\d+)#i', $current_path, $matches)) {
        $property_id = intval($matches[1]);
        $post = get_post($property_id);
        
        if ($post) {
            $title = get_the_title($property_id);
            $seo_title = get_post_meta($property_id, 'rank_math_title', true);
            if ($seo_title) {
                $seo_title = str_replace('%title%', $title, $seo_title);
                $seo_title = str_replace('%sep%', '-', $seo_title);
                $seo_title = str_replace('%sitename%', 'Casa Pronto Imobiliare', $seo_title);
            } else {
                $seo_title = $title . ' | Casa Pronto Imobiliare';
            }
            
            $seo_desc = get_post_meta($property_id, 'rank_math_description', true);
            if (!$seo_desc) {
                $seo_desc = wp_trim_words($post->post_content, 25);
            }
            
            $canonical = get_permalink($property_id);
            
            // Clean out the generic homepage tags
            $html = preg_replace('/<title>.*?<\\/title>/s', '', $html);
            $html = preg_replace('/<meta[^>]*name=["\\\'"]description["\\\'"][^>]*>/i', '', $html);
            $html = preg_replace('/<link[^>]*rel=["\\\'"]canonical["\\\'"][^>]*>/i', '', $html);
            $html = preg_replace('/<meta[^>]*property=["\\\'"]og:(title|description|url|type)["\\\'"][^>]*>/i', '', $html);
            
            // Inject property specific tags
            $head_inject = '
                <title>' . esc_html($seo_title) . '</title>
                <meta name="description" content="' . esc_attr($seo_desc) . '">
                <link rel="canonical" href="' . esc_url($canonical) . '">
                <meta property="og:title" content="' . esc_attr($seo_title) . '">
                <meta property="og:description" content="' . esc_attr($seo_desc) . '">
                <meta property="og:url" content="' . esc_url($canonical) . '">
                <meta property="og:type" content="article">
            ';
            $html = str_replace('</head>', $head_inject . '</head>', $html);
        } else {
            // Strip any canonical from the fallback so it does not falsely claim to be the homepage
            $html = preg_replace('/<link[^>]*rel=["\\\'"]canonical["\\\'"][^>]*>/i', '', $html);
        }
    } elseif (strpos($parsed_url['path'], '/proprietati') === 0) {
        $category = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : '';
        $tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'toate';
        $zone = isset($_GET['zone']) ? sanitize_text_field($_GET['zone']) : '';
        
        if ($category || $zone || $tab !== 'toate') {
            $catLabel = "Anunțuri Imobiliare";
            if ($category) {
                $catLabel = ucfirst(str_replace('-', ' ', $category));
            }
            
            $zoneLabel = "Alba Iulia și împrejurimi";
            if ($zone) {
                $zoneLabel = ucfirst(str_replace('-', ' ', $zone));
            } else if ($category) {
                $zoneLabel = "Alba Iulia";
            }
            
            $actionLabel = "de vânzare și închiriere";
            if ($tab === "cumparare") $actionLabel = "de vânzare";
            elseif ($tab === "inchiriere") $actionLabel = "de închiriat";
            elseif ($tab === "vandute") $actionLabel = "vândute";
            
            if (!$category) {
                $seo_title = "Anunțuri Imobiliare {$actionLabel} {$zoneLabel} | Casa Pronto";
            } else {
                $seo_title = "{$catLabel} {$actionLabel} {$zoneLabel} | Casa Pronto";
            }
            
            $catDescLabel = $category ? strtolower($catLabel) : "proprietăți imobiliare";
            $descZoneLabel = $zone ? $zoneLabel : "Alba Iulia";
            $seo_desc = "Vezi cele mai noi oferte de {$catDescLabel} {$actionLabel} în {$descZoneLabel}. Găsește-ți casa de vis cu Casa Pronto!";
            
            // Clean out the generic homepage tags
            $html = preg_replace('/<title>.*?<\\/title>/s', '', $html);
            $html = preg_replace('/<meta[^>]*name=["\\\'"]description["\\\'"][^>]*>/i', '', $html);
            $html = preg_replace('/<meta[^>]*property=["\\\'"]og:(title|description)["\\\'"][^>]*>/i', '', $html);
            
            // Inject dynamic tags
            $head_inject = '
                <title>' . esc_html($seo_title) . '</title>
                <meta name="description" content="' . esc_attr($seo_desc) . '">
                <meta property="og:title" content="' . esc_attr($seo_title) . '">
                <meta property="og:description" content="' . esc_attr($seo_desc) . '">
            ';
            $html = str_replace('</head>', $head_inject . '</head>', $html);
        }
    } else {
        // Strip the canonical for unknown/404 routes as well
        $html = preg_replace('/<link[^>]*rel=["\\\'"]canonical["\\\'"][^>]*>/i', '', $html);
    }
    
    echo $html;
    exit;
}

// 5. ULTIMATE FAILSAFE
echo "<h1>Casa Pronto SPA Theme Error: index.html not found.</h1>";
exit;
