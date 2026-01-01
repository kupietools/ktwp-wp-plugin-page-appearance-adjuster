document.addEventListener('DOMContentLoaded', function() {
    'use strict';
		let earthquakeTimeout;
	    let earthquakeTimer=Date.now()
    loadSettings();
   

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
			saturation:"100",
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
            settings.saturation === defaults.saturation &&
            settings.temperature === defaults.temperature &&
            settings.hue === defaults.hue &&
            settings.darkMode === defaults.darkMode &&
            (!settings.fontSize || settings.fontSize === defaults.fontSize) &&
            settings.earthquake === defaults.earthquake) {
                
            document.getElementById('brightness').value = defaults.brightness;
            document.getElementById('saturation').value = defaults.saturation;
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
        document.getElementById('saturation').value = settings.saturation || defaults.saturation;
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
            saturation: document.getElementById('saturation').value,
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
    const saturation = document.getElementById('saturation').value;
    const hue = document.getElementById('hue').value;
    const isDarkMode = document.getElementById('darkmode-toggle').checked;
    
    let tempValue = parseInt(temperature);
    let filterString = "brightness("+brightness+"%) contrast("+contrast+"%) saturate("+saturation+"%) ";
    
	
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
		overlay.style.zIndex="0";
    } else if (tempValue > 0) {
        // Cool (blue) tint using overlay
        let coolness = tempValue * 0.5;
        let blueAmount = Math.min(255, Math.round(coolness * 2.55));
        overlay.style.backgroundColor = "rgba(0, "+(blueAmount*.5)+", "+blueAmount+", "+(coolness * 0.02)+")";// coolness * 0.01)";
		overlay.style.zIndex="999999";
    } else {
        overlay.style.backgroundColor = 'transparent';
		overlay.style.zIndex="0";
    }
    
    // Add base hue rotation if specified
    if (hue !== "0") {
        filterString += " hue-rotate("+hue+"deg)";
    }
    
  if (isDarkMode) {
        filterString += ' brightness(75%) contrast(150%) saturate(140%) invert(1) hue-rotate(180deg)';
    }
    
 document.documentElement.style.filter = filterString;
	
/* this is all pretty inefficent, yes. To-do: make this run only when darkmode is toggled.Also, selectors to be exempt from inversion for darkmode should be a settings.  */
   
   
    const images = document.querySelectorAll('img, *[style*="background-image:"]');
    for (let img of images) {
		if(img.getAttribute("data-ktwp-paa-imgOrigFilter")!=null && isDarkMode) /* already was in dark mode */
{ 
	img.style.filter = img.getAttribute("data-ktwp-paa-imgOrigFilter") + ' brightness(133%) contrast(66%) saturate(71%) invert(1) hue-rotate(180deg)' ;
	  console.log("dm still on");
} else if (isDarkMode && img.getAttribute("data-ktwp-paa-imgOrigFilter")==null) /* dark mode just turned on */
{ img.setAttribute("data-ktwp-paa-imgOrigFilter",img.style.filter);
	img.style.filter = img.getAttribute("data-ktwp-paa-imgOrigFilter")+' /* brightness(133%) contrast(66%) saturate(71%) */ invert(1) hue-rotate(180deg)  saturate(71%) contrast(66%) brightness(133%) ' ;
  console.log("dm just turned on");
}
																			
		else if(img.getAttribute("data-ktwp-paa-imgOrigFilter")!=null && !isDarkMode) /* dark mode just turned off */
{	img.style.filter = img.getAttribute("data-ktwp-paa-imgOrigFilter");										
									img.removeAttribute("data-ktwp-paa-imgOrigFilter");	
 console.log("dm turned off");
																			} else {  console.log("dm still off");}
																			/* do nothing if not dark mode  and not just turned off*/
																			
																			
/*        img.style.filter = (img.style.filter ?? "") + (isDarkMode ? ' brightness(133%) contrast(66%) saturate(71%) invert(1) hue-rotate(180deg)' : ''); */

}



}

	function applyEarthquake() {
    const intensity = document.getElementById('earthquake').value;
    const style = document.getElementById('earthquake-style') || document.createElement('style');
    style.id = 'earthquake-style';

    // Always ensure the style tag exists and has the base keyframes
    if (!style.parentElement) {
        document.head.appendChild(style);
        // Define base keyframes with CSS variables (only once)
        style.innerHTML = `
            @keyframes earthquake {
                0%, 100% { transform: translate(0, 0) rotate(0deg); transform-origin: 50vw 200vh; }
                25% { transform: translate(calc(var(--shake-x) * -1), var(--shake-y)) rotate(var(--shake-deg)); transform-origin: 50vw 200vh;}
                50% { transform: translate(var(--shake-x), calc(var(--shake-y) * -1)) rotate(calc(var(--shake-deg) * -1)); transform-origin: 50vw 200vh; }
                75% { transform: translate(calc(var(--shake-x) * -1), calc(var(--shake-y) * -1)) rotate(var(--shake-deg)); transform-origin: 50vw 200vh;}
            }

            /* No 'animation' property here directly, we'll set it inline or via a specific class */
            .do-earthquake-parent {
                animation: earthquake 0.83s infinite;
                -webkit-animation: earthquake 0.83s infinite;
                will-change: transform;
            }
            .do-earthquake-child {
                animation: earthquake 0.25s infinite;
                -webkit-animation: earthquake 0.25s infinite;
                will-change: transform;
            }
        `;
    }

    const animatedParents = document.querySelectorAll('body > *:not(.page-adjuster-control):not(.temperatureOverlay)');
    const animatedChildren = document.querySelectorAll('body > *:not(.page-adjuster-control):not(.temperatureOverlay) > *');

    if (intensity === "0") {
        // Clear properties and classes
        document.documentElement.style.removeProperty('--shake-x');
        document.documentElement.style.removeProperty('--shake-y');
        document.documentElement.style.removeProperty('--shake-deg');
        animatedParents.forEach(el => el.classList.remove('do-earthquake-parent'));
        animatedChildren.forEach(el => el.classList.remove('do-earthquake-child'));
    } else {
        const shake = (Math.max(Math.log10(intensity),0)) ** 15 * 16;
        document.documentElement.style.setProperty('--shake-x', `${shake}px`);
        document.documentElement.style.setProperty('--shake-y', `${shake}px`);
        document.documentElement.style.setProperty('--shake-deg', `${shake}deg`);

        // 1. Pause existing animations and remove the class
        animatedParents.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.classList.remove('do-earthquake-parent');
        });
        animatedChildren.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.classList.remove('do-earthquake-child');
        });

        // 2. Force reflow (clears animation state)
        void document.body.offsetHeight;

        // 3. Re-add the class and resume animation in next tick
        requestAnimationFrame(() => {
            animatedParents.forEach(el => {
                el.classList.add('do-earthquake-parent');
                el.style.animationPlayState = ''; // Resume (or remove property)
            });
            animatedChildren.forEach(el => {
                el.classList.add('do-earthquake-child');
                el.style.animationPlayState = ''; // Resume (or remove property)
            });
            void document.body.offsetHeight; // Final reflow
        });
    }
    return intensity;
}
	function XapplyEarthquakeBody() {
    const intensity = document.getElementById('earthquake').value;
	const style = document.getElementById('earthquake-style')||document.createElement('style');
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
  will-change: transform;
                animation: earthquake 0.25s infinite;
            }
body > *:not(.page-adjuster-control)  {
  will-change: transform;
                animation: earthquake 0.83s infinite;
            }
        `;
    }
    
   if (!style.parentElement) {
        document.head.appendChild(style);
    }
		 
   /* // Delay the reflow slightly
    setTimeout(() => {
        if (style.parentElement) {
            void document.body.offsetHeight;
        }
    }, 10); // A small delay, e.g., 10ms
    */
		return intensity;
}
	
	// REPLACED jQuery $(document).ready
    // Since we are already inside 'DOMContentLoaded', we can just run the code.
    
        // REPLACED $('.page-adjuster-icon').on('click')
        const icon = document.querySelector('.page-adjuster-icon');
        if(icon) {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                // REPLACED $('.page-adjuster-panel').toggle();
                const panel = document.querySelector('.page-adjuster-panel');
                if(panel) {
                    if (window.getComputedStyle(panel).display === 'none') {
                        panel.style.display = 'block';
                    } else {
                        panel.style.display = 'none';
                    }
                }
            });
        }
        
        // REPLACED $('.page-adjuster-close-button').on('click')
        const closeBtn = document.querySelector('.page-adjuster-close-button');
        if(closeBtn) {
            closeBtn.addEventListener('click', function() {
                const panel = document.querySelector('.page-adjuster-panel');
                if(panel) panel.style.display = 'none';
            });
        }
        
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
        
        // REPLACED $('#reset-button').on('click')
        const resetBtn = document.getElementById('reset-button');
        if(resetBtn) {
            resetBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('brightness').value = 100;
                document.getElementById('contrast').value = 100;
                document.getElementById('saturation').value = 100;
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
        }
        
        // REPLACED $(document).on('click')
        document.addEventListener('click', function(event) {
            const panel = document.querySelector('.page-adjuster-panel');
            // Check if click is outside .page-adjuster-control
            // REPLACED !$(event.target).closest('.page-adjuster-control').length
            if (!event.target.closest('.page-adjuster-control') && 
                panel && window.getComputedStyle(panel).display !== 'none') {
                panel.style.display = 'none';
            }
        });
});