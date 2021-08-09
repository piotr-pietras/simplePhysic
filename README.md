# simplePhysic
## _HTML elements affected by laws of physic_

SimplePhysic is a library that manipulates dom object to obtain physic simulation of HTML elements. You can find sample usage on [simplePhysic-sample]. If you are interested how impulse collision is calculated visit [wiki collision response].

## Installation

```sh
npm i simple-physic
```

## Usage

First import module into project

```javascript
import simplePhysic from 'simple-physic'
```
Then markdown scene and rectangles. 

```javascript
        <div id="simplePhysic-scene">
            <div className="simplePhysic-rectangle"></div>
            <div className="simplePhysic-rectangle"></div>
        </div>
```
Then pass document object into it and start simulation

```javascript
  useEffect(() => {
    simplePhysic.parseDOM(document)
    simplePhysic.start()
  })
```

## Development
Things to add & change:

- add friction impulse
- add easy interface for controllig physic's aspects
- replace rectangle collision detect algorithm for more effective
- test prediction collision algorithm instead remove one
- add drag&drop sensitive to speed of cursor
- remove absolute position requirement for html elements
- add one constrained behaviour

## 

[simplePhysic-sample]: <https://github.com/peterooo94/simplePhysic-sample>
[wiki collision response]: <https://en.wikipedia.org/wiki/Collision_response>