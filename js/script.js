document.addEventListener('DOMContentLoaded', function() {
    'use strict';
		let earthquakeTimeout;
	    let earthquakeTimer=Date.now();
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
        const settings = JSON.parse(localStorage.getItem('ktwp_paa_pageAdjusterSettings') || '{}');
        
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
    console.log("Computed font size",computedSize);
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
			//saved settings match defaults

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

        const sliders = document.querySelectorAll('#ktwp-paa-page-adjuster-panel > .panel-content > .control-group > input[type="range"]');
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
            earthquake: document.getElementById('earthquake').value,
			savedAt: Date.now()
        };
        localStorage.setItem('ktwp_paa_pageAdjusterSettings', JSON.stringify(settings));
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

function resetEarthquake(){
	document.getElementById('earthquake').value="0";
	applyEarthquake();
	saveSettings(); 
	const slider = document.querySelector('#ktwp-paa-page-adjuster-panel > .panel-content > .control-group > input#earthquake[type="range"]');
	updateValueDisplay(slider);
/* alert("Earthquake subsided. Use the gear icon tab at left to open the Page Appearance Adjuster if you wish to restart it."); nah, that's annoying. Let's just leave them wondering, if they don't understand how it started. */
	
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
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(calc(var(--shake-x) * -1), var(--shake-y)) rotate(var(--shake-deg)); }
                50% { transform: translate(var(--shake-x), calc(var(--shake-y) * -1)) rotate(calc(var(--shake-deg) * -1)); }
                75% { transform: translate(calc(var(--shake-x) * -1), calc(var(--shake-y) * -1)) rotate(var(--shake-deg)); }
            }

            /* No 'animation' property here directly, we'll set it inline or via a specific class */
            .do-earthquake-parent {
                animation: earthquake 0.83s infinite;
                -webkit-animation: earthquake 0.83s infinite;
                will-change: transform;
                transform-origin: 50vw 200vh;
            }
            .do-earthquake-child {
                animation: earthquake 0.25s infinite;
                -webkit-animation: earthquake 0.25s infinite;
                will-change: transform;
            }

           #ktwp-paa-earthquake-killswitch {
	text-align: center;
	/* width: 350px; */
	position: fixed;
	bottom: 15px;
	left: 15px;
	opacity: .95;
	background: white;
	border: 1px solid #FF6666;
	border-radius: 6px;
	padding: 4px;
	font-size: .9em;
z-index:99999;
box-shadow: 5px 5px 15px rgba(0,0,0,.13);
}
           #ktwp-paa-earthquake-killswitch:hover {opacity:1;}
#ktwp-paa-earthquake-killswitch-link  {color:blue; cursor:pointer;}
#ktwp-paa-earthquake-killswitch:hover > #ktwp-paa-earthquake-killswitch-link {text-decoration:underline;}
.first[style*="display:none"] + .second { display: block; }
#page-adjuster-control:has(> #ktwp-paa-page-adjuster-panel[style*="block"])~#ktwp-paa-earthquake-killswitch {display:none !important;  /* only show when main control panel is hidden, with pure css. Aren't I clever? */}
        `;
    }

   const excludedTags = ['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'META', 'LINK'];
const animatedParents = Array.from(document.querySelectorAll('body > *:not(.page-adjuster-control):not(.temperatureOverlay):not(#ktwp-paa-earthquake-killswitch)'))
        .filter(el => !excludedTags.includes(el.tagName));
    
  /* no, less performant...  const animatedChildren = document.querySelectorAll('body > *:not(.page-adjuster-control):not(.temperatureOverlay):not(#ktwp-paa-earthquake-killswitch) > *'); */

/* first suggestion was this, but doesn't exclude excludedTags const animatedChildren = [];
animatedParents.forEach(parent => {
    animatedChildren.push(...parent.children); // or querySelectorAll('*') if you need all descendants
}); */


    const animatedChildren = [];
    animatedParents.forEach(parent => {
        Array.from(parent.children).forEach(child => {
            if (!excludedTags.includes(child.tagName)) {
                animatedChildren.push(child);
            }
        });
    });

    if (intensity === "0") {
        // Clear properties and classes
        document.documentElement.style.removeProperty('--shake-x');
        document.documentElement.style.removeProperty('--shake-y');
        document.documentElement.style.removeProperty('--shake-deg');
        animatedParents.forEach(el => el.classList.remove('do-earthquake-parent'));
        animatedChildren.forEach(el => el.classList.remove('do-earthquake-child'));
		const killswitch = document.getElementById('ktwp-paa-earthquake-killswitch');
		if (killswitch) {	killswitch.remove(); }
    } else {
		
		const killswitch = document.getElementById('ktwp-paa-earthquake-killswitch') || document.createElement('div');
    
	killswitch.id = 'ktwp-paa-earthquake-killswitch';

	if (!killswitch.parentElement && intensity != "0" && document.getElementById("ktwp-paa-page-adjuster-panel").style.display != "none") { 
killswitch.innerHTML = `<div id="ktwp-paa-earthquake-killswitch"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="32" height="32">

 <g>
  <path id="svg_1" d="m25.89733,17.18561c-0.4399,0 -0.84555,0.30697 -1.05139,0.79725l-1.71142,4.06947l-2.10881,-7.79595c-0.16112,-0.58913 -0.59151,-0.99256 -1.08565,-1.01417c-0.5081,-0.01841 -0.9461,0.34379 -1.1383,0.91731l-1.44658,4.33602l-2.28358,-17.26083c-0.10466,-0.7252 -0.64352,-1.27591 -1.19571,-1.23229c-0.58453,0.01681 -1.07328,0.50108 -1.15288,1.23229l-2.01621,20.03198l-1.6353,-10.7516c-0.0961,-0.63596 -0.50555,-1.12183 -1.01524,-1.20467c-0.50016,-0.08405 -1.00287,0.25414 -1.22488,0.83926l-2.67527,7.03593l-4.15611,0l0,3.00048l4.90525,0c0.45766,0 0.8741,-0.33019 1.07233,-0.85208l1.43865,-3.78211l2.3191,15.24771c0.10752,0.70879 0.59848,1.21708 1.16779,1.21708l0.03172,0c0.58231,-0.01961 1.06789,-0.56872 1.14686,-1.29713l1.98513,-19.68378l1.66415,12.96123c0.09357,0.65277 0.5173,1.15104 1.03903,1.22348c0.52966,0.06444 1.02222,-0.29696 1.22647,-0.9105l1.78721,-5.35259l1.98862,7.3477c0.15319,0.56471 0.55916,0.96334 1.0311,1.01016c0.47384,0.03322 0.92294,-0.26374 1.14591,-0.79324l2.66353,-6.33553l5.10443,0l0,-3.00088l-5.81995,0z" fill="red" stroke="null"></path>
 </g>
</svg><br><b>WARNING</b><br>Magnitude <span id="ktwp-paa-earthquake-intensity">0.0</span> Earthquake in progress<br><span id="ktwp-paa-earthquake-killswitch-link" href="#">Turn Earthquake off</a></div>`/*`&#xe252 Earthquake is active. <a href="#">Turn Earthquake off</a>`*/; // would rather make this "open settings" but I'm tired right now
document.body.appendChild(killswitch);
killswitch.addEventListener('click', resetEarthquake);} 
		
		document.getElementById('ktwp-paa-earthquake-intensity').innerHTML = intensity;

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
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(-${shake}px, ${shake}px) rotate(${shake}deg); }
                50% { transform: translate(${shake}px, -${shake}px) rotate(-${shake}deg); }
                75% { transform: translate(-${shake}px, -${shake}px) rotate(${shake}deg); }
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
        const sliders = document.querySelectorAll('#ktwp-paa-page-adjuster-panel > .panel-content > .control-group > input[type="range"]');
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

                const sliders = document.querySelectorAll('#ktwp-paa-page-adjuster-panel > .panel-content > .control-group > input[type="range"]');
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
	let ktwpparams = new URLSearchParams(document.location.search);
let ktwp_param = ktwpparams.get("kupietools");
			console.log("paa",ktwpparams);
if (ktwp_param=="paa")
			{	
console.log("Paa true",ktwp_param,ktwp_param=="paa");
document.querySelector('.page-adjuster-panel').style.display="block";}
});