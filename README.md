# Advent of Code - JS Template
Template with frontend for Advent of Code solutions written in JavaScript.

![GIF preview](assets/preview.gif)

## Development
Run `index.html` in a local server.

## Structure
Solution classes can be placed in `javascript/solutions/`:
```
javascript/
├─ solutions/
│  ├─ day1/
│  │  ├─ PartOne.js
│  ├─ .gitkeep
```

The solution class must extend from `Solution`, and implement a public `process` method:
```javascript
// javascript/solutions/day1/PartOne.js

import Solution from '../../Solution.js';

export default class PartOne extends Solution {
  process() {
    // return result of processing `this.input`
  }
}

```

Lastly, it must be mapped to the correct day and part in `javascript/SOLUTION_CLASSES_MAP.js`:
```javascript
// javascript/SOLUTION_CLASSES_MAP.js

import DayOnePartOne from './solutions/day1/PartOne.js';

export default {
  1: {
    1: DayOnePartOne,
  },
}

```

## Credits
- Theme and UI components from
  <a href="https://oat.ink/" target="_blank" rel="noopener noreferrer">Oat UI</a>
- Animations from
  <a href="https://oat-animate.dharmeshgurnani.com/" target="_blank" rel="noopener noreferrer">Oat Animate</a>
