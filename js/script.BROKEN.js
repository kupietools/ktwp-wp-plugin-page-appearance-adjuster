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
.page-adjuster-icon,   .page-adjuster-panel {box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);}
.page-adjuster-icon svg {
  color: #FFF;
  animation: gearPulse 1s linear infinite;
  filter: drop-shadow( 1px 1px 2px rgba(255, 255, 0, .8));
}

@keyframes gearPulse {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
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
            font-size: 14px !important;
        }
        .slider-control, .control-group {
            margin: 10px 0 !important;
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
                valueDisplay.textContent = slider.value + '°';
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
                25% { transform: translate(-px, px) rotate(deg);  transform-origin: 50vw 200vh;}
                50% { transform: translate(px, -px) rotate(-deg); transform-origin: 50vw 200vh; }
                75% { transform: translate(-px, -px) rotate(deg);  transform-origin: 50vw 200vh;}
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