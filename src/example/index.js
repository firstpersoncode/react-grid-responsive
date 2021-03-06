import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'immutability-helper'

import ReactGridResponsive from '../index'

import './index.css'

class Example extends Component {
  constructor () {
    super()
    this.state = {
      boxes_1: {
        isStatic: false,
        height: 400,
        boxes: [
          {
            id: 'test-1',
            lg: { x: 0, y: 0, w: 3, h: 5 },
            md: { x: 0, y: 0, w: 4, h: 5 },
            sm: { x: 0, y: 0, w: 6, h: 5 },
            xs: { x: 0, y: 0, w: 12, h: 5 },
            xxs: { x: 0, y: 0, w: 12, h: 5 }
          },
          {
            id: 'test-2',
            lg: { x: 3, y: 0, w: 3, h: 5 },
            md: { x: 4, y: 0, w: 4, h: 5 },
            sm: { x: 6, y: 0, w: 6, h: 5 },
            xs: { x: 0, y: 2, w: 12, h: 5 },
            xxs: { x: 0, y: 2, w: 12, h: 5 }
          },
          {
            id: 'test-3',
            lg: { x: 6, y: 0, w: 3, h: 5 },
            md: { x: 8, y: 0, w: 4, h: 5 },
            sm: { x: 0, y: 2, w: 6, h: 5 },
            xs: { x: 0, y: 4, w: 6, h: 5 },
            xxs: { x: 0, y: 4, w: 12, h: 5 }
          },
          {
            id: 'test-4',
            lg: { x: 9, y: 0, w: 3, h: 5 },
            md: { x: 0, y: 2, w: 4, h: 5 },
            sm: { x: 6, y: 2, w: 6, h: 5 },
            xs: { x: 6, y: 4, w: 6, h: 5 },
            xxs: { x: 0, y: 6, w: 12, h: 5 }
          }
        ]
      },
      boxes_2: {
        isStatic: false,
        height: 400,
        boxes: [
          {
            id: 'test-1',
            lg: { x: 0, y: 0, w: 3, h: 5 },
            md: { x: 0, y: 0, w: 4, h: 5 },
            sm: { x: 0, y: 0, w: 6, h: 5 },
            xs: { x: 0, y: 0, w: 12, h: 5 },
            xxs: { x: 0, y: 0, w: 12, h: 5 }
          },
          {
            id: 'test-2',
            lg: { x: 3, y: 0, w: 3, h: 5 },
            md: { x: 4, y: 0, w: 4, h: 5 },
            sm: { x: 6, y: 0, w: 6, h: 5 },
            xs: { x: 0, y: 2, w: 12, h: 5 },
            xxs: { x: 0, y: 2, w: 12, h: 5 }
          },
          {
            id: 'test-3',
            lg: { x: 6, y: 0, w: 3, h: 5 },
            md: { x: 8, y: 0, w: 4, h: 5 },
            sm: { x: 0, y: 2, w: 6, h: 5 },
            xs: { x: 0, y: 4, w: 6, h: 5 },
            xxs: { x: 0, y: 4, w: 12, h: 5 }
          },
          {
            id: 'test-4',
            lg: { x: 9, y: 0, w: 3, h: 5 },
            md: { x: 0, y: 2, w: 4, h: 5 },
            sm: { x: 6, y: 2, w: 6, h: 5 },
            xs: { x: 6, y: 4, w: 6, h: 5 },
            xxs: { x: 0, y: 6, w: 12, h: 5 }
          }
        ]
      }
    }
  }

  componentDidMount () {
    if (localStorage.getItem('boxes_1')) {
      let boxes_1 = JSON.parse(localStorage.getItem('boxes_1'))
      console.log(boxes_1)
      this.setState({
        boxes_1
      })
    }

    if (localStorage.getItem('boxes_2')) {
      let boxes_2 = JSON.parse(localStorage.getItem('boxes_2'))

      this.setState({
        boxes_2
      })
    }
  }

  testUpdate = () => {
    if (this.state.boxes_1.isStatic) {
      return
    }

    this.setState(state => ({
      boxes_1: update(state.boxes_1, {
        boxes: {
          [0]: {
            lg: {
              y: {
                $set: state.boxes_1.boxes[0].lg.y + 1
              }
            }
          }
        }
      })
    }))
  }

  testUpdate2 = () => {
    if (this.state.boxes_1.isStatic) {
      return
    }

    this.setState(state => ({
      boxes_1: update(state.boxes_1, {
        boxes: {
          [1]: {
            lg: {
              w: {
                $set: state.boxes_1.boxes[1].lg.w + 1
              }
            }
          }
        }
      })
    }))
  }

  toggleStatic = boxes => e => {
    this.setState(state => ({
      [boxes]: update(state[boxes], {
        isStatic: {
          $set: !state[boxes].isStatic
        }
      })
    }), () => {
      localStorage.setItem(boxes, JSON.stringify(this.state[boxes]))
    })
  }

  handleChange = boxes => container => {
    this.setState(state => ({
      [boxes]: update(state[boxes], {
        height: {
          $set: container.height
        },
        boxes: {
          $set: container.boxes
        }
      })
    }), () => {
      localStorage.setItem(boxes, JSON.stringify(this.state[boxes]))
    })
  }

  handleWidthChange = boxes => container => {
    this.setState(state => ({
      [boxes]: update(state[boxes], {
        height: {
          $set: container.height
        },
        boxes: {
          $set: container.boxes
        }
      })
    }))
  }

  handleBreakPointChange = boxes => container => {
    this.setState(state => ({
      [boxes]: update(state[boxes], {
        height: {
          $set: container.height
        },
        boxes: {
          $set: container.boxes
        }
      })
    }))
  }

  onDrag = (boxes, i) => box => {
    this.setState(state => ({
      [boxes]: update(state[boxes], {
        boxes: {
          [i]: {
            $set: box
          }
        }
      })
    }))
  }

  onDragEnd = (boxes, i) => box => {
    this.setState(state => ({
      [boxes]: update(state[boxes], {
        boxes: {
          [i]: {
            $set: box
          }
        }
      })
    }))
  }

  onResizeEnd = (boxes, i) => box => {
    this.setState(state => ({
      [boxes]: update(state[boxes], {
        boxes: {
          [i]: {
            $set: box
          }
        }
      })
    }))
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleStatic('boxes_1')}>static: {this.state.boxes_1.isStatic ? 'true' : 'false'}</button>
        <button onClick={this.testUpdate}>update test-1</button>
        <button onClick={this.testUpdate2}>update test-2</button>

        <ReactGridResponsive
          className='container'
          isStatic={this.state.boxes_1.isStatic}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={12}
          rowHeight={30}
          height={this.state.boxes_1.height}
          onChange={this.handleChange('boxes_1')}
          onBreakpointChange={this.handleBreakPointChange('boxes_1')}
          onWidthChange={this.handleWidthChange('boxes_1')}>
          {
            this.state.boxes_1.boxes.map((box, i) => {
              return (
                <div
                  className='box'
                  key={i}
                  id={box.id}
                  box={box}>
                  {box.id}
                </div>
              )
            })
          }
        </ReactGridResponsive>

        <button onClick={this.toggleStatic('boxes_2')}>static: {this.state.boxes_2.isStatic ? 'true' : 'false'}</button>
        <ReactGridResponsive
          className='container'
          isStatic={this.state.boxes_2.isStatic}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={12}
          rowHeight={30}
          height={this.state.boxes_2.height}
          onChange={this.handleChange('boxes_2')}
          onBreakpointChange={this.handleBreakPointChange('boxes_2')}
          onWidthChange={this.handleWidthChange('boxes_2')}>
          {
            this.state.boxes_2.boxes.map((box, i) => {
              return (
                <div
                  className='box'
                  // onDrag={this.onDrag('boxes_2', i)}
                  // onDragEnd={this.onDragEnd('boxes_2', i)}
                  // onResizeEnd={this.onResizeEnd('boxes_2', i)}
                  key={i}
                  id={box.id}
                  box={box}>
                  {box.id}
                </div>
              )
            })
          }
        </ReactGridResponsive>
      </div>
    )
  }
}

render(<Example />, document.getElementById("root"))
