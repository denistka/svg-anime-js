# SVG animation 

Implementation of JS class for helping build svg animation. Based on anime.js  


### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```


### How to use

include to your app

```
import  SvgAnimation  from './svg-animation';
const justSmile = new SvgAnimation({
        element: document.getElementById('just-smile'),
        statesIds: ['smile', 'angry', 'surprise']
    });
justSmile.moveTo('some animation state');    
```

make similar inline svg.
Change path tags attributes for changing some polygons between states.

```
data-transition-link-id - animation name
data-transition-options - any anime.js options
data-timeline-offset - anime.js timeline offset
```   

```
<svg>
        <g id="initial">
            <path
                    data-transition-link-id="face-bg"
                    data-transition-options='{"translateY": 0}'
                    id="face-bg" class="cls-1"
                    d="M248.7,173.84c0-14.93,0-30-3.71-44.51S233.33,100.92,220.66,93c-37-23-128.41-19.57-162.77,6.28-26.8,20.17-26.19,57.12-22,87.19C38,202,45,217.45,57.77,226.46,71.9,236.44,90.41,237,107.71,237,156.77,237.13,248.59,244.64,248.7,173.84Z"/>
            <path .../>
            <path .../>
            <path .../>
        </g>

        <g id="angry" visibility="hidden">
            <path
                    data-transition-link-id="face-bg"
                    data-transition-options='{"duration": 3000}'
                    data-timeline-offset="+=50"
                    fill="#D67554"
                    class="cls-1"
                    d="M248.7,173.84c0-14.93,0-30-3.71-44.51S233.33,100.92,220.66,93c-37-23-128.41-19.57-162.77,6.28-26.8,20.17-26.19,57.12-22,87.19C38,202,45,217.45,57.77,226.46,71.9,236.44,90.41,237,107.71,237,156.77,237.13,248.59,244.64,248.7,173.84Z"/>
             <path .../>
             <path .../>
             <path .../>
        </g>

        <g id="surprise" visibility="hidden">
            <path 
                  data-transition-link-id="face-bg"
                  data-transition-options='{"duration": 500, "easing": "easeOutExpo", "translateY": 10}'
                  class="cls-3"
                  d="M167.88,196.88c-5.18-3.21-8.06-4.85-14.41-4.26-5.93.55-6.75,1.31-10.84,4.93-1.81,1.61-3.87,8.46-3.75,13.83.2,8.51,10.08,13.28,18.42,11.9,8.76-1.46,14.75-9.19,15.56-17.72C173.25,201.39,170.21,198.32,167.88,196.88Z"/>
            <path .../>
            <path .../>
            <path .../>      
        </g>

    </svg>
```