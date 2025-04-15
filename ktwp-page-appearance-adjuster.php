<?php
/*
Plugin Name: Kupietools Page Appearance Adjuster
Description: Adds a control panel to adjust page brightness, contrast, and color temperature
Version: 1.0
Author: Michael Kupietz
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add the control panel HTML and required scripts/styles
function page_adjuster_enqueue_assets() {
    wp_enqueue_style('page-adjuster-styles', plugins_url('css/style.css', __FILE__));
    wp_enqueue_script('page-adjuster-script', plugins_url('js/script.js', __FILE__), array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'page_adjuster_enqueue_assets');

// Add the control panel HTML to the footer
function page_adjuster_add_control_panel() {
    ?>
    <div id="page-adjuster-control" class="page-adjuster-control">
       <div class="page-adjuster-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
    <span class="hover-text">Visual Settings</span>
</div>

        <div class="page-adjuster-panel">
            <div class="panel-header">
                <span>Page Appearance</span>
                <button class="close-button">&times;</button>
            </div>
            <div class="panel-content">
                <div class="control-group">
                    <label for="brightness">Brightness</label>
                    <input type="range" id="brightness" min="50" max="150" value="100">
                </div>
                <div class="control-group">
                    <label for="contrast">Contrast</label>
                    <input type="range" id="contrast" min="50" max="150" value="100">
                </div>
                <div class="control-group">
                    <label for="temperature">Color Temperature</label>
                    <input type="range" id="temperature" min="-50" max="50" value="0">
                </div>
				<div class="control-group">
					<label for="hue">Hue Rotation <span class="value">0¨¬</span></label>
    <input type="range" id="hue" min="0" max="360" value="0">
    
</div><div class="control-group">
					<label for="saturation">Saturation <span class="value">200</span></label>
    <input type="range" id="saturation" min="0" max="200" value="0">
    
</div>
				<div class="control-group">
    <label for="fontsize">Font Size <span class="value"></span></label>
    <input type="range" id="fontsize" min="7" max="40" step="1">
   
</div>
				<div class="setting-row">
    <label class="setting-label">
        <input type="checkbox" id="darkmode-toggle">
        Dark Mode
    </label>
</div>
				<div class="control-group">
    <label for="earthquake">Earthquake <span class="value">0.0</span></label>
    <input type="range" id="earthquake" min="0" max="10" step="0.1" value="0">
  
</div>


			
            </div>
			<button id="reset-button" style="width: 100%; padding: 8px; background: #808080; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 10px;">Reset to Default</button>
        </div>
    </div>
    <?php
}
add_action('wp_footer', 'page_adjuster_add_control_panel');

// Create the required directories and files upon plugin activation
function page_adjuster_activate() {
    // Create the CSS file
    $css_dir = plugin_dir_path(__FILE__) . 'css';
    if (!file_exists($css_dir)) {
        mkdir($css_dir, 0755, true);
    }
    
    $css_content = <<<CSS
.page-adjuster-control {
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 9999;
}
.page-adjuster-icon {
    position: relative;
    width: 24px;
    height: 24px;
    background: #808080;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 3px;
	box-shadow: 0 0 8px black, 0 0 30px white !important;
}

.page-adjuster-icon .hover-text {
    position: absolute;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    background: #808080;
    color: white;
    padding: 4px 8px;
    border-radius: 3px;
    white-space: nowrap;
    opacity: 0;
    width: 0;
    overflow: hidden;
    transition: all 0.3s ease;
}

.page-adjuster-icon:hover .hover-text {
	opacity: 1;
	width: 130px;
	text-align: center;
}

.page-adjuster-icon svg {
    color: white;
}

.page-adjuster-panel {
    display: none;
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 250px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 15px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.panel-content {display:grid; grid-template-columns:auto auto; grid-column-gap:6px;}

.close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
}
 
.control-group {
    margin-bottom: 2px;
}

.control-group label {
    display: block;
    margin-bottom: 0;
    color: #666;
}

.control-group input[type="range"] {
    width: 100%;
}

.setting-row {
    margin: 0 0; /* was 10px 0 */
    display: flex;
    align-items: center;
}

.setting-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
    cursor: pointer;
}

#darkmode-toggle {
    cursor: pointer;margin-left:10px; margin-right:0px;
}

CSS;
    
    file_put_contents($css_dir . '/style.css', $css_content);
    
    // Create the JavaScript file
    $js_dir = plugin_dir_path(__FILE__) . 'js';
    if (!file_exists($js_dir)) {
        mkdir($js_dir, 0755, true);
    }
    
    $js_content = <<<JS
(function($) {
    'use strict';
    loadSettings();
    
    const style = document.createElement('style');
    style.innerHTML = `
        .page-adjuster-control {
            font-size: 14px !important;
            position: fixed !important;
            z-index: 10000 !important;
        }
.page-adjuster-icon,   .page-adjuster-panel {box-shadow: /*0 4px 8px rgba(0, 0, 0, 0.4)*/ 0 2px 8px rgba(0, 0, 0, 0.8), 0 0 24px white;}
.page-adjuster-icon svg {
  color: #FFF;
  animation: gearPulse 0.5s linear infinite;
  filter: drop-shadow( 1px 1px 2px rgba(255, 255, 0, .8));
}

@keyframes gearPulse {
  0% {
    opacity: 0.7;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.7;
    transform: scale(1) rotate(90deg);
  }
}

        .page-adjuster-panel {
            width: 300px !important;
            padding: 16px !important;
        }
        .page-adjuster-panel label,
        .page-adjuster-panel input,
        .page-adjuster-panel .value,
        .page-adjuster-panel button {
            font-size: 12px !important;
        }
        .slider-control, .control-group {
             margin: 0 0 !important; /* was 10px 0 */
        }

.overflowxhidden {overflow-x:hidden;}
    `;
    document.head.appendChild(style);

    function updateValueDisplay(slider) {
        const valueDisplay = slider.parentElement.querySelector('.value');
        if (valueDisplay) {
            if (slider.id === 'fontsize') {
                valueDisplay.textContent = slider.value + 'px';
            } else if (slider.id === 'earthquake') {
                valueDisplay.textContent = parseFloat(slider.value).toFixed(1);
            } else  if (slider.id === 'hue') {
                valueDisplay.textContent = slider.value + 'Â°';
            } else {
                valueDisplay.textContent = slider.value + '%';
            }
        }
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('pageAdjusterSettings') || '{}');
        
        const defaults = {
            brightness: "100",
            contrast: "100",
            temperature: "0",
            hue: "0",
            darkMode: false,
            fontSize: undefined,
            earthquake: "0"
        };

        const computedSize = window.getComputedStyle(document.documentElement).fontSize;
        const initialSize = parseInt(computedSize);
        defaults.fontSize = String(initialSize);

        if (settings.brightness === defaults.brightness && 
            settings.contrast === defaults.contrast &&
            settings.temperature === defaults.temperature &&
            settings.hue === defaults.hue &&
            settings.darkMode === defaults.darkMode &&
            (!settings.fontSize || settings.fontSize === defaults.fontSize) &&
            settings.earthquake === defaults.earthquake) {
                
            document.getElementById('brightness').value = defaults.brightness;
            document.getElementById('contrast').value = defaults.contrast;
            document.getElementById('temperature').value = defaults.temperature;
            document.getElementById('hue').value = defaults.hue;
            document.getElementById('darkmode-toggle').checked = defaults.darkMode;
            document.getElementById('earthquake').value = defaults.earthquake;
            const fontSlider = document.getElementById('fontsize');
            fontSlider.value = defaults.fontSize;
            updateValueDisplay(fontSlider);
            return;
        }

        document.getElementById('brightness').value = settings.brightness || defaults.brightness;
        document.getElementById('contrast').value = settings.contrast || defaults.contrast;
        document.getElementById('temperature').value = settings.temperature || defaults.temperature;
        document.getElementById('hue').value = settings.hue || defaults.hue;
        document.getElementById('darkmode-toggle').checked = settings.darkMode || defaults.darkMode;
        document.getElementById('earthquake').value = settings.earthquake || defaults.earthquake;
        
        const fontSlider = document.getElementById('fontsize');
        fontSlider.value = settings.fontSize || initialSize;
        updateValueDisplay(fontSlider);
        
        applyFilters();
        applyFontSize();
        applyEarthquake();

        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(updateValueDisplay);
    }

    function saveSettings() {
        const settings = {
            brightness: document.getElementById('brightness').value,
            contrast: document.getElementById('contrast').value,
            temperature: document.getElementById('temperature').value,
            hue: document.getElementById('hue').value,
            darkMode: document.getElementById('darkmode-toggle').checked,
            fontSize: document.getElementById('fontsize').value,
            earthquake: document.getElementById('earthquake').value
        };
        localStorage.setItem('pageAdjusterSettings', JSON.stringify(settings));
    }

    function applyFontSize() {
        const size = document.getElementById('fontsize').value;
        const existingStyle = document.getElementById('page-adjuster-font-size');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'page-adjuster-font-size';
        style.innerHTML = "html[data-page-adjuster], html[data-page-adjuster]:root, :root[data-page-adjuster], :root[data-page-adjuster]:root { font-size: "+size+"px !important; }";
        document.head.appendChild(style);
        document.documentElement.setAttribute('data-page-adjuster', '');
    }
	
	function sliderToTemperature(sliderValue) {
    // Convert slider value (-50 to 50) to temperature (1500K to 15000K)
    // Using exponential mapping for more natural control
    const normalizedValue = (parseFloat(sliderValue) + 50) / 100; // Convert to 0-1 range
    return 1500 * Math.pow(10, normalizedValue * Math.log10(10)); // 1500K to 15000K
}
function temperatureToFilters(temperature) {
    // Convert -50 to 50 range to proper color temperature representation
    const normalizedTemp = parseInt(temperature);
    
    if (normalizedTemp > 0) {
        // Cool temperature (blueish)
        return {
            sepia: 0,
            brightness: 100,
            blueHue: normalizedTemp * 1.5 // gradually increase blue tint
        };
    } else if (normalizedTemp < 0) {
        // Warm temperature (yellowish/orangish)
        return {
            sepia: Math.abs(normalizedTemp) * 2,
            brightness: 100 + Math.abs(normalizedTemp) * 0.3,
            blueHue: 0
        };
    } else {
        // Neutral
        return {
            sepia: 0,
            brightness: 100,
            blueHue: 0
        };
    }
}
function applyFilters() {
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const temperature = document.getElementById('temperature').value;
    const hue = document.getElementById('hue').value;
    const isDarkMode = document.getElementById('darkmode-toggle').checked;
    
    let tempValue = parseInt(temperature);
    let filterString = "brightness("+brightness+"%) contrast("+contrast+"%) ";
    
	
	 const earthquake = document.getElementById('earthquake').value;
    
    // Handle earthquake overflow class
    if (parseFloat(earthquake) > 0) {
        document.body.classList.add('overflowxhidden');
    } else {
        document.body.classList.remove('overflowxhidden');
    }
    
	
	
    // Create or get the overlay element
    let overlay = document.getElementById('temperature-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'temperature-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.mixBlendMode = 'color';
       // overlay.style.transition = 'background-color 0.2s';
        document.body.appendChild(overlay);
    }

    if (tempValue < 0) {
        // Warm (amber/orange) tint
        let warmth = Math.abs(tempValue);// * 0.7;
        filterString += "sepia("+warmth+"%) saturate("+(100 + warmth * 0.3)+"%)";
        overlay.style.backgroundColor = 'transparent';
    } else if (tempValue > 0) {
        // Cool (blue) tint using overlay
        let coolness = tempValue * 0.5;
        let blueAmount = Math.min(255, Math.round(coolness * 2.55));
        overlay.style.backgroundColor = "rgba(0, "+(blueAmount*.5)+", "+blueAmount+", "+(coolness * 0.02)+")";// coolness * 0.01)";
    } else {
        overlay.style.backgroundColor = 'transparent';
    }
    
    // Add base hue rotation if specified
    if (hue !== "0") {
        filterString += " hue-rotate("+hue+"deg)";
    }
    
    if (isDarkMode) {
        filterString += ' invert(1) hue-rotate(180deg)';
    }
    
    document.documentElement.style.filter = filterString;
    
    const images = document.getElementsByTagName('img');
    for (let img of images) {
        img.style.filter = isDarkMode ? 'invert(1) hue-rotate(180deg)' : '';
    }
}
	function WorksapplyFiltersapplyFilters() {
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const temperature = document.getElementById('temperature').value;
    const hue = document.getElementById('hue').value;
    const isDarkMode = document.getElementById('darkmode-toggle').checked;
    
    let tempValue = parseInt(temperature);
    let filterString = "brightness("+brightness+"%) contrast("+contrast+"%) "; 
    
    if (tempValue < 0) {
        // Warm (amber/orange) tint: sepia for warmth
        let warmth = Math.abs(tempValue) * 0.7;
        filterString += "sepia("+warmth+"%) saturate("+(100 + warmth * 0.3)+"%)";
    } else if (tempValue > 0) {
        // Cool (blue) tint: direct blue hue rotation
        filterString += "hue-rotate(200deg) saturate("+(100 + tempValue)+"%) sepia("+tempValue+"%) hue-rotate("+(-200 + tempValue)+"deg)";
    }
    
    // Add base hue rotation if specified
    if (hue !== "0") {
        filterString += " hue-rotate("+hue+"deg)";
    }
    
    if (isDarkMode) {
        filterString += ' invert(1) hue-rotate(180deg)';
    }
    
    document.documentElement.style.filter = filterString;
    
    const images = document.getElementsByTagName('img');
    for (let img of images) {
        img.style.filter = isDarkMode ? 'invert(1) hue-rotate(180deg)' : '';
    }
}
	
    function zapplyFilters() {
        const brightness = document.getElementById('brightness').value;
        const contrast = document.getElementById('contrast').value;
        const temperature = document.getElementById('temperature').value;
        const hue = document.getElementById('hue').value;
        const isDarkMode = document.getElementById('darkmode-toggle').checked;
        
        const warmth = temperature > 0 ? temperature / 50 : 0;
        const coolness = temperature < 0 ? Math.abs(temperature) / 50 : 0;
        
        let filterString = 
            'brightness(' + brightness + '%) ' +
            'contrast(' + contrast + '%) ' +
            'sepia(' + warmth + ') ' +
            'brightness(' + (100 + warmth * 15) + '%) ' +
            'hue-rotate(' + (coolness * -30 + parseInt(hue)) + 'deg)';
        
        if (isDarkMode) {
            filterString += ' invert(1) hue-rotate(180deg)';
        }
        
        document.documentElement.style.filter = filterString;
        
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            img.style.filter = isDarkMode ? 'invert(1) hue-rotate(180deg)' : '';
        }
    }
	
	function applyEarthquake() {
    const intensity = document.getElementById('earthquake').value;
    const style = document.getElementById('earthquake-style') || document.createElement('style');
    style.id = 'earthquake-style';
      
    if (intensity === "0") {
        style.innerHTML = '';
    } 
		else {
        const shake = (Math.max(Math.log10(intensity),0)) ** 15 * 16;//Math.log10(intensity) ** 8 * 6;//intensity * 0.3;
        style.innerHTML = `
            @keyframes earthquake {
                0%, 100% { transform: translate(0, 0) rotate(0deg); transform-origin: 50vw 200vh; }
                25% { transform: translate(-${shake}px, ${shake}px) rotate(${shake}deg);  transform-origin: 50vw 200vh;}
                50% { transform: translate(${shake}px, -${shake}px) rotate(-${shake}deg); transform-origin: 50vw 200vh; }
                75% { transform: translate(-${shake}px, -${shake}px) rotate(${shake}deg);  transform-origin: 50vw 200vh;}
            }

            body > *:not(.page-adjuster-control) > * {
                animation: earthquake 0.25s infinite;
            }
body > *:not(.page-adjuster-control)  {
                animation: earthquake 0.83s infinite;
            }
        `;
    }
    
    if (!style.parentElement) {
        document.head.appendChild(style);
    }
		return intensity;
}
	
	$(document).ready(function() {
        $('.page-adjuster-icon').on('click', function(e) {
            e.preventDefault();
            $('.page-adjuster-panel').toggle();
        });
        
        $('.close-button').on('click', function() {
            $('.page-adjuster-panel').hide();
        });
        
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(function(slider) {
            ['change', 'input'].forEach(function(event) {
                slider.addEventListener(event, function() {
                    if (this.id === 'fontsize') {
                        applyFontSize();
                    } else if (this.id === 'earthquake') {
                        const intensity = applyEarthquake();
														  if(event=="change") { /* 'input' triggers on start of drag, 'change' on mouseup, but adding the class triggers a reflow of the whole page which interrupts the mouse drag, so set the class on mouseup */
						if (parseFloat(intensity) > 0) {
        document.body.classList.add('overflowxhidden');
    } else {
        document.body.classList.remove('overflowxhidden');
    }}  
                    } else {
                        applyFilters();
                    }
                    updateValueDisplay(this);
                    saveSettings();
                });
            });
        });
        
        document.getElementById('darkmode-toggle').addEventListener('change', function() {
            applyFilters();
            saveSettings();
        });
        
        $('#reset-button').on('click', function(e) {
            e.preventDefault();
            document.getElementById('brightness').value = 100;
            document.getElementById('contrast').value = 100;
            document.getElementById('temperature').value = 0;
            document.getElementById('hue').value = 0;
            document.getElementById('darkmode-toggle').checked = false;
            document.getElementById('earthquake').value = 0;
            
            const fontSizeStyle = document.getElementById('page-adjuster-font-size');
            if (fontSizeStyle) {
                fontSizeStyle.remove();
            }
            
            document.documentElement.removeAttribute('data-page-adjuster');
            
            const computedSize = window.getComputedStyle(document.documentElement).fontSize;
            const defaultSize = parseInt(computedSize);
            const fontSlider = document.getElementById('fontsize');
            fontSlider.value = defaultSize;
            
            applyFilters();
            applyEarthquake();
            saveSettings();

            const sliders = document.querySelectorAll('input[type="range"]');
            sliders.forEach(updateValueDisplay);
        });
        
        $(document).on('click', function(event) {
            if (!$(event.target).closest('.page-adjuster-control').length && 
                $('.page-adjuster-panel').is(':visible')) {
                $('.page-adjuster-panel').hide();
            }
        });
    });
})(jQuery);
JS;
/* jquery version, doesn't work with slim
 (function($) {
    'use strict';
    
    // Load saved settings
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('pageAdjusterSettings') || '{}');
        $('#brightness').val(settings.brightness || 100);
        $('#contrast').val(settings.contrast || 100);
        $('#temperature').val(settings.temperature || 0);
        applyFilters();
    }
    
    // Save settings
    function saveSettings() {
        const settings = {
            brightness: $('#brightness').val(),
            contrast: $('#contrast').val(),
            temperature: $('#temperature').val()
        };
        localStorage.setItem('pageAdjusterSettings', JSON.stringify(settings));
    }
    
    // Apply filters to the page
    function applyFilters() {
        const brightness = $('#brightness').val();
        const contrast = $('#contrast').val();
        const temperature = $('#temperature').val();
        
        const warmth = temperature > 0 ? temperature / 50 : 0;
        const coolness = temperature < 0 ? Math.abs(temperature) / 50 : 0;
        
        $('html').css('filter', `
            brightness(${brightness}%) 
            contrast(${contrast}%)
            sepia(${warmth})
            brightness(${100 + warmth * 15}%)
            hue-rotate(${coolness * -30}deg)
        `);
    }
    
    // Initialize
    $(document).ready(function() {
        loadSettings();
        
      
    // Toggle panel
$('.page-adjuster-icon').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('.page-adjuster-panel').slideToggle(200);
});  
        // Close panel
        $('.close-button').click(function() {
            $('.page-adjuster-panel').slideUp(200);
        });
        
        // Handle slider changes
        $('input[type="range"]').on('input', function() {
            applyFilters();
            saveSettings();
        });
        
        // Click outside to close
        $(document).click(function(event) {
            if (!$(event.target).closest('.page-adjuster-control').length) {
                $('.page-adjuster-panel').slideUp(200);
            }
        });
    });
})(jQuery);
*/
    
    file_put_contents($js_dir . '/script.js', $js_content);
}
register_activation_hook(__FILE__, 'page_adjuster_activate');