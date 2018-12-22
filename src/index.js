import React, {
  PureComponent,
  cloneElement,
} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import _ from 'lodash'

import ResizeAware from 'react-resize-aware'

import { isTouchDevice, isEmpty, includesInArray } from './utils/validator'

import './index.css'

class ReactGridResponsive extends PureComponent {
  containerRef = null
  boxes = []
  temp = null

  state = {
    breakpoint: 'lg',
    boxes: [],
    selected: null,
    width: undefined,
    height: undefined,
    target: null,
    isStatic: false
    // containerRel: null
  }

  componentDidMount () {
    this.initContainer()
  }

  componentWillReceiveProps (next) {
    this.initBoxesByProps(next)
    this.updateContainerHeightByProps(next)
    this.updateContainerIsStaticByProps(next)
  }

  /* ---------------CONTAINER-------------- */
  initContainer = () => {
    const ref = ReactDOM.findDOMNode(this.containerRef)
    const container = ref.getBoundingClientRect()

    this.setState({
      width: container.width,
      height: container.height
    }, () => {
      this.updateBreakPoints()
      this.renderBoxes()
    })
  }

  updateBreakPoints = () => {
    const { width, breakpoint } = this.state
    const { breakpoints } = this.props

    let newBreakpoint

    if (width >= breakpoints.lg) {
      newBreakpoint = 'lg'
    } else if (width >= breakpoints.md && width < breakpoints.lg) {
      newBreakpoint = 'md'
    } else if (width >= breakpoints.sm && width < breakpoints.md) {
      newBreakpoint = 'sm'
    } else if (width >= breakpoints.xs && width < breakpoints.sm) {
      newBreakpoint = 'xs'
    } else if (width >= breakpoints.xxs && width < breakpoints.xs) {
      newBreakpoint = 'xxs'
    }

    if (breakpoint !== newBreakpoint) {
      this.setState({ breakpoint: newBreakpoint }, () => {
        this.renderBoxes()
        this.onBreakpointChangeHandler()
      })
    }
  }

  updateContainerHeightByProps = next => {
    if (next.height !== this.state.height) {
      this.setState({
        height: next.height
      }, () => {
        this.renderBoxes()
      })
    }
  }

  updateContainerIsStaticByProps = next => {
    if (next.isStatic !== this.state.isStatic) {
      this.setState({
        isStatic: next.isStatic
      }, () => {
        this.renderBoxes()
      })
    }
  }

  onSizeChangeContainer = ({ width, height }) => {
    // console.log(width)
    this.setState({
      width,
      // height
    }, () => {
      this.updateBreakPoints()
      this.renderBoxes()
      this.onWidthChangeHandler()
    })
  }

  onChangeHandler = () => {
    const { boxes, breakpoint, height, width } = this.state
    const { onChange } = this.props
    // const ref = ReactDOM.findDOMNode(this.containerRef)
    // const container = ref.getBoundingClientRect()

    if (onChange && typeof onChange === 'function') {
      onChange({
        height,
        width,
        breakpoint,
        boxes: !isEmpty(boxes) ? boxes.map(box => {
          return box.props.box
        }) : []
      })
    }
  }

  onBreakpointChangeHandler = () => {
    const { boxes, breakpoint, height, width } = this.state
    const { onBreakpointChange } = this.props
    // const ref = ReactDOM.findDOMNode(this.containerRef)
    // const container = ref.getBoundingClientRect()

    if (onBreakpointChange && typeof onBreakpointChange === 'function') {
      onBreakpointChange({
        height,
        width,
        breakpoint,
        boxes: !isEmpty(boxes) ? boxes.map(box => {
          return box.props.box
        }) : []
      })
    }
  }

  onWidthChangeHandler = () => {
    const { boxes, breakpoint, height, width } = this.state
    const { onWidthChange } = this.props
    // const ref = ReactDOM.findDOMNode(this.containerRef)
    // const container = ref.getBoundingClientRect()

    if (onWidthChange && typeof onWidthChange === 'function') {
      onWidthChange({
        height,
        width,
        breakpoint,
        boxes: !isEmpty(boxes) && boxes.map(box => {
          return box.props.box
        })
      })
    }
  }

  // initContainerRel = e => {
  //   const ref = ReactDOM.findDOMNode(this.containerRef)
  //   const container = ref.getBoundingClientRect()
  //
  //   let x = container.left
  //   let y = container.top
  //
  //   this.setState({
  //     containerRel: {
  //       x,
  //       y
  //     }
  //   })
  // }

  // container resize height handlers
  onStartResizeContainer = e => {
    this.initContainerResizeEvent()

    // if (isTouchDevice()) {
    //   this.initContainerRel(e.touches[0])
    // } else {
    //   this.initContainerRel(e)
    // }
    e.preventDefault()
  }

  onResizeContainer = e => {
    if (isTouchDevice()) {
      this.resizeContainer(e.touches[0])
    } else {
      this.resizeContainer(e)
    }
    e.preventDefault()
  }

  onEndResizeContainer = e => {
    this.endResizeContainer()

    this.onChangeHandler()

    this.removeContainerResizeEvent()

    e.preventDefault()
  }

  resizeContainer = e => {
    const ref = ReactDOM.findDOMNode(this.containerRef)
    const container = ref.getBoundingClientRect()
    // const body = document.body

    const { height, boxes } = this.state
    const { rowHeight } = this.props

    let snapY = (1 / rowHeight) * height

    let targetY = (e.clientY - container.top) / snapY * snapY

    if (Math.trunc(targetY) < 200) {
      targetY = 200
    }

    // ref.style.minHeight = Math.trunc(targetY) + 'px'
    this.setState({
      height: Math.trunc(targetY)
    }, () => {
      this.renderBoxes()
    })

    // TODO: detect if mouse touch the bottom of window on resizing container
    // add autoscroll while resizing container
    // if (Math.trunc(e.clientY) >= Math.trunc(body.getBoundingClientRect().height)) {
    //   // console.log(window.scrollBy)
    //   // window.scrollTo(0, Math.trunc(targetY += 150))
    //   // console.log(body.style.height)
    // }

    // if (Math.trunc(targetX / snapX) >= cols) {
    //   targetX = cols
    // } else if (Math.trunc(targetX / snapX) < 1) {
    //   targetX = 1
    // }
    //
    // if (Math.trunc(targetY / snapY) >= rowHeight) {
    //   targetY = rowHeight
    // } else if (Math.trunc(targetY / snapY) < 1) {
    //   targetY = 1
    // }

    // this.setState(state => ({
    //   target: update(state.target, {
    //     $set: updateTarget
    //   }),
    //   boxes: update(state.boxes, {
    //     [selected]: {
    //       $set: updateChild
    //     }
    //   })
    // }))
  }

  endResizeContainer = () => {
    // TODO:
    return
  }

  initContainerResizeEvent = () => {
    if (isTouchDevice()) {
      document.addEventListener('touchmove', this.onResizeContainer, {
        passive: false
      })
      document.addEventListener('touchend', this.onEndResizeContainer, {
        passive: false
      })
    } else {
      document.addEventListener('mousemove', this.onResizeContainer, false)
      document.addEventListener('mouseup', this.onEndResizeContainer, false)
    }
  }

  removeContainerResizeEvent = () => {
    if (isTouchDevice()) {
      document.removeEventListener('touchmove', this.onResizeContainer)
      document.removeEventListener('touchend', this.onEndResizeContainer)
    } else {
      document.removeEventListener('mousemove', this.onResizeContainer)
      document.removeEventListener('mouseup', this.onEndResizeContainer)
    }
  }

  /* ---------------BOXES-------------- */
  mapChildren = () => {
    const { width, height, breakpoint, isStatic } = this.state
    const { children, cols, rowHeight } = this.props

    const boxes = React.Children.map(children, (child, i) => {
      const { box, id } = child.props

      let boxW = (box[breakpoint].w / cols) * width
      let boxH = (box[breakpoint].h / rowHeight) * height
      let boxX = (box[breakpoint].x / cols) * width
      let boxY = (box[breakpoint].y / rowHeight) * height

      let style = {
        // margin: 0,
        opacity: 1,
        // pointerEvents: 'auto',
        width: boxW,
        height: boxH,
        transform: `translate(${boxX}px, ${boxY}px)`,
        // background: 'red',
        position: 'absolute',
        zIndex: i
      }

      return cloneElement(child, {
        // className: 'box',
        id,
        style,
        ref: box => this.boxes[i] = box,
        rel: { x: null, y: null }
      }, (
        <div>
          {
            !isStatic
              ? (
                <span
                  className='box-dragger right-top'
                  onMouseDown={this.onStartDragBox(i)}
                  onTouchStart={this.onStartDragBox(i)} />
              )
              : null
          }

          {child.props.children}

          {
            !isStatic
              ? (
                <span
                  className='box-resizer right-bottom'
                  onMouseDown={this.onStartResizeBox(i)}
                  onTouchStart={this.onStartResizeBox(i)} />
              )
              : null
          }
        </div>
      ))
    })

    return boxes
  }

  renderBoxes = () => {
    // const { children } = this.props
    //
    // if (isEmpty(children)) {
    //   return
    // }

    this.setState({
      boxes: this.mapChildren()
    })
  }

  // renderBoxes = () => {
  //   // const { boxes } = this.state
  //   // // const { width, height, boxes, breakpoint } = this.state
  //   // // const { cols, rowHeight } = this.props
  //   //
  //   // if (isEmpty(boxes)) {
  //   //   return
  //   // }
  //
  //   this.setState({
  //     boxes: this.mapChildren()
  //   })
  //
  //   // boxes.forEach((child, i) => {
  //   //   const { box } = child.props
  //   //   let boxW = (box[breakpoint].w / cols) * width
  //   //   let boxH = (box[breakpoint].h / rowHeight) * height
  //   //   let boxX = (box[breakpoint].x / cols) * width
  //   //   let boxY = (box[breakpoint].y / rowHeight) * height
  //   //
  //   //   this.setState(state => ({
  //   //     boxes: update(state.boxes, {
  //   //       [i]: {
  //   //         $set: update(child, {
  //   //           props: {
  //   //             style: {
  //   //               width: { $set: boxW },
  //   //               height: { $set: boxH },
  //   //               transform: { $set: `translate(${boxX}px, ${boxY}px)` },
  //   //             }
  //   //           }
  //   //         })
  //   //       }
  //   //     })
  //   //   }))
  //   // })
  // }

  initBoxesByProps = next => {
    const { boxes } = this.state
    const nextChildren = next.children

    if (isEmpty(nextChildren) || isEmpty(boxes)) {
      return
    }

    nextChildren.forEach((nextChild, i) => {
      const nextBox = nextChild.props.box
      const prevBox = boxes[i].props.box

      Object.keys(nextBox).forEach(key => {
        if (
          nextBox && nextBox.hasOwnProperty(key) && nextBox[key] &&
          prevBox && prevBox.hasOwnProperty(key) && prevBox[key] &&
          includesInArray([
            'lg', 'md', 'sm', 'xs', 'xxs'
          ], key)
        ) {
          Object.keys(nextBox[key]).forEach(pos => {
            if (nextBox[key][pos] !== prevBox[key][pos]) {
              this.setState(state => ({
                boxes: update(state.boxes, {
                  [i]: {
                    props: {
                      box: {
                        [key]: {
                          $set: nextBox[key]
                        }
                      }
                    }
                  }
                })
              }), () => {
                this.renderBoxes()
                this.onChangeHandler()
              })
            }
          })
        }
      })
    })
  }

  initRelBox = (e, isResize) => {
    const { boxes, selected } = this.state
    const child = boxes[selected]
    const refChild = ReactDOM.findDOMNode(this.boxes[selected])
    const boxRef = refChild.getBoundingClientRect()
    const ref = ReactDOM.findDOMNode(this.containerRef)
    const container = ref.getBoundingClientRect()
    const body = document.body

    let x = e.pageX + container.x - boxRef.left + body.scrollLeft - body.clientLeft
    let y = e.pageY + container.y - boxRef.top + body.scrollTop - body.clientTop

    if (isResize) {
      x = e.pageX - boxRef.width + body.scrollLeft - body.clientLeft
      y = e.pageY - boxRef.height + body.scrollTop - body.clientTop
    }

    let updateChild = update(child, {
      props: {
        rel: {
          x: {
            $set: x
          },
          y: {
            $set: y
          }
        },
        style: {
          opacity: {
            $set: '0.5'
          }
        }
      }
    })

    let updateTarget = update(updateChild, {
      ref: {
        $set: temp => this.temp = 'temp-' + selected // to avoid conflict in ref
      },
      props: {
        style: {
          opacity: {
            $set: '0.5'
          }
        }
      }
    })

    this.setState(state => ({
      target: updateTarget,
      boxes: update(state.boxes, {
        [selected]: {
          $set: updateChild
        }
      })
    }))
  }

  // box drag handlers
  onStartDragBox = i => e => {
    const { boxes } = this.state

    e.persist()

    this.setState({
      selected: i
    }, () => {
      const child = boxes[i]
      const { box, onDragStart } = child.props

      this.initDragEvent()

      if (isTouchDevice()) {
        this.initRelBox(e.touches[0])
      } else {
        this.initRelBox(e)
      }

      if (onDragStart && typeof onDragStart === 'function') {
        onDragStart(box)
      }
    })

    e.preventDefault()
  }

  onDragBox = e => {
    const { boxes, selected } = this.state
    const child = boxes[selected]
    const { box, onDrag } = child.props

    if (isTouchDevice()) {
      this.dragBox(e.touches[0])
    } else {
      this.dragBox(e)
    }

    if (onDrag && typeof onDrag === 'function') {
      onDrag(box)
    }

    e.preventDefault()
  }

  onEndDragBox = e => {
    // const { boxes, selected } = this.state
    // const child = boxes[selected]
    // const { box, onDragEnd } = child.props

    this.endDragBox()

    // if (onDragEnd && typeof onDragEnd === 'function') {
    //   onDragEnd(box)
    // }

    this.onChangeHandler()

    this.setState({
      selected: null
    }, () => {
      this.removeDragEvent()
    })

    e.preventDefault()
  }

  dragBox = e => {
    const ref = ReactDOM.findDOMNode(this.containerRef)
    const container = ref.getBoundingClientRect()

    ref.style.overflow = 'auto'

    const { width, height, target, boxes, selected, breakpoint } = this.state
    const { cols, rowHeight } = this.props
    const child = boxes[selected]
    const { box, rel } = child.props

    let boxW = (box[breakpoint].w / cols) * width
    let boxH = (box[breakpoint].h / rowHeight) * height
    let snapX = (1 / cols) * width
    let snapY = (1 / rowHeight) * height

    let targetX = Math.trunc((e.clientX - rel.x) / snapX) * snapX
    let targetY = Math.trunc((e.clientY - rel.y) / snapY) * snapY

    if (Math.trunc(targetX + boxW) > Math.trunc(container.left + width)) {
      targetX = Math.trunc(container.left + width - boxW)
    } else if (Math.trunc(targetX) < 0) {
      targetX = 0
    }

    if (Math.trunc(targetY + boxH) > Math.trunc(container.top + height)) {
      targetY = Math.trunc(container.top + height - boxH)
    } else if (Math.trunc(targetY) < 0) {
      targetY = 0
    }

    // TODO: prevent element dragged to another element
    // console.log(Math.trunc(boxH / snapY))
    // boxes.forEach((box, i) => {
    //   if (i !== selected) {
    //     const refBox = ReactDOM.findDOMNode(this.boxes[i]).getBoundingClientRect()
    //     const { box } = this.state.boxes[i].props
    //     const selectedBox = this.state.boxes[selected].props.box
    //     if (
    //       Math.trunc(targetX / snapX) + selectedBox[breakpoint].w === box[breakpoint].x + 1
    //       // (
    //       //   Math.trunc(targetY / snapY) + selectedBox[breakpoint].h > box[breakpoint].y + box[breakpoint].h &&
    //       //   Math.trunc(targetY / snapY) + selectedBox[breakpoint].h < box[breakpoint].y
    //       // )
    //     ) {
    //       ReactDOM.findDOMNode(this.boxes[i]).style.background = 'green'
    //       // if (
    //       //   Math.trunc(targetY + boxH) <= Math.trunc(refBox.top) ||
    //       //   Math.trunc(targetY) >= Math.trunc(refBox.top + refBox.height)
    //       // ) {
    //       //   ReactDOM.findDOMNode(this.boxes[selected]).style.background = 'lightblue'
    //       // }
    //     } else if (
    //       Math.trunc(targetX / snapX) === box[breakpoint].x + box[breakpoint].w - 1
    //       // (
    //       //   Math.trunc(targetY / snapY) + selectedBox[breakpoint].h > box[breakpoint].y + box[breakpoint].h &&
    //       //   Math.trunc(targetY / snapY) + selectedBox[breakpoint].h < box[breakpoint].y
    //       // )
    //     ) {
    //       ReactDOM.findDOMNode(this.boxes[i]).style.background = 'purple'
    //       // if (
    //       //   Math.trunc(targetY + boxH) < Math.trunc(refBox.top) ||
    //       //   Math.trunc(targetY) > Math.trunc(refBox.top + refBox.height)
    //       // ) {
    //       //   ReactDOM.findDOMNode(this.boxes[selected]).style.background = 'yellow'
    //       // }
    //     } else if (
    //       Math.trunc(targetY / snapY) + selectedBox[breakpoint].h === box[breakpoint].y + 1
    //       // (
    //       //   Math.trunc(targetY / snapY) + selectedBox[breakpoint].h > box[breakpoint].y + box[breakpoint].h &&
    //       //   Math.trunc(targetY / snapY) + selectedBox[breakpoint].h < box[breakpoint].y
    //       // )
    //     ) {
    //       ReactDOM.findDOMNode(this.boxes[i]).style.background = 'yellow'
    //       // if (
    //       //   Math.trunc(targetY + boxH) < Math.trunc(refBox.top) ||
    //       //   Math.trunc(targetY) > Math.trunc(refBox.top + refBox.height)
    //       // ) {
    //       //   ReactDOM.findDOMNode(this.boxes[selected]).style.background = 'yellow'
    //       // }
    //     } else {
    //       ReactDOM.findDOMNode(this.boxes[i]).style.background = 'red'
    //     }
    //   }
    // })

    let updateChild = update(child, {
      props: {
        // box: {
        //   [breakpoint]: {
        //     x: {
        //       $set: Math.trunc(targetX / snapX)
        //     },
        //     y: {
        //       $set: Math.trunc(targetY / snapY)
        //     }
        //   }
        // }
        style: {
          transform: {
            $set: `translate(${e.clientX - rel.x}px, ${e.clientY - rel.y}px)`
          },
        }
      }
    })

    let updateTarget = update(target, { props: { box: { [breakpoint]: {
      x: {
        $set: Math.trunc(targetX / snapX)
      },
      y: {
        $set: Math.trunc(targetY / snapY)
      }}}, style: {
      transition: {
        $set: 'transform ease-out .1s'
      },
      transform: {
        $set: `translate(${targetX}px, ${targetY}px)`
      },
      background: {
        $set: 'lightblue'
      }
    }}})

    this.setState(state => ({
      target: updateTarget,
      boxes: update(state.boxes, {
        [selected]: {
          $set: updateChild
        }
      })
    }))
  }

  endDragBox = () => {
    const { target, boxes, selected, width, height, breakpoint } = this.state
    const { cols, rowHeight } = this.props
    const { box, onDragEnd } = target.props
    const child = boxes[selected]

    let boxX = (box[breakpoint].x / cols) * width
    let boxY = (box[breakpoint].y / rowHeight) * height

    let updateChild = update(child, { props: {
      box: {
        $set: box
      }, style: {
      opacity: {
        $set: 1
      },
      transform: {
        $set: `translate(${boxX}px, ${boxY}px)`
      },
      zIndex: {
        $set: boxes.length - 1
      }
    }}})

    // // TODO: update zIndex
    // let counter = 2
    // let updateOtherBoxes = otherBoxes => otherBoxes.map((box, i) => {
    //   if (i !== selected) {
    //     // if (box.props.style.zIndex === boxes.length - 1) {
    //     //   box = update(box, { props: { style: {
    //     //     zIndex: {
    //     //         $set: selected
    //     //         // $set: box.props.style.zIndex ? box.props.style.zIndex - 1 : 1
    //     //     }
    //     //   }}})
    //     // }
    //
    //     box = update(box, { props: { style: {
    //       zIndex: {
    //           // $set: selected
    //           // $set: box.props.style.zIndex ? box.props.style.zIndex - 1 : 0
    //           $set: boxes.length - counter
    //       }
    //     }}})
    //     counter++
    //   }
    //
    //   return box
    // })

    this.setState(state => ({
      target: null,
      boxes: update(state.boxes, {
        // $apply: updateOtherBoxes,
        [selected]: {
          $set: updateChild
        }
      })
    }), () => {
      if (onDragEnd && typeof onDragEnd === 'function') {
        onDragEnd(box)
      }
    })
  }

  initDragEvent = () => {
    if (isTouchDevice()) {
      document.addEventListener('touchmove', this.onDragBox, {
  			passive: false
  		})
  		document.addEventListener('touchend', this.onEndDragBox, {
  			passive: false
  		})
    } else {
      document.addEventListener('mousemove', this.onDragBox, false)
      document.addEventListener('mouseup', this.onEndDragBox, false)
    }
  }

  removeDragEvent = () => {
    if (isTouchDevice()) {
      document.removeEventListener('touchmove', this.onDragBox)
  		document.removeEventListener('touchend', this.onEndDragBox)
    } else {
      document.removeEventListener('mousemove', this.onDragBox)
      document.removeEventListener('mouseup', this.onEndDragBox)
    }
  }

  // box resize handlers
  onStartResizeBox = i => e => {
    const { boxes } = this.state

    e.persist()

    this.setState({
      selected: i
    }, () => {
      const child = boxes[i]
      const { box, onResizeStart } = child.props

      this.initResizeEvent()

      if (isTouchDevice()) {
        this.initRelBox(e.touches[0], true)
      } else {
        this.initRelBox(e, true)
      }

      if (onResizeStart && typeof onResizeStart === 'function') {
        onResizeStart(box)
      }
    })
    e.preventDefault()
  }

  onResizeBox = e => {
    const { boxes, selected } = this.state
    const child = boxes[selected]
    const { box, onResize } = child.props

    if (isTouchDevice()) {
      this.resizeBox(e.touches[0])
    } else {
      this.resizeBox(e)
    }

    if (onResize && typeof onResize === 'function') {
      onResize(box)
    }

    e.preventDefault()
  }

  onEndResizeBox = e => {
    // const { boxes, selected } = this.state
    // const child = boxes[selected]
    // const { box, onResizeEnd } = child.props

    this.endResizeBox()

    // if (onResizeEnd && typeof onResizeEnd === 'function') {
    //   onResizeEnd(box)
    // }

    this.onChangeHandler()

    this.setState({
      selected: null
    }, () => {
      this.removeResizeEvent()
    })

    e.preventDefault()
  }

  resizeBox = e => {
    const ref = ReactDOM.findDOMNode(this.containerRef)
    const container = ref.getBoundingClientRect()

    ref.style.overflow = 'auto'

    const { width, height, target, boxes, selected, breakpoint } = this.state
    const { cols, rowHeight } = this.props
    const child = boxes[selected]
    const { rel } = child.props

    let snapX = (1 / cols) * width
    let snapY = (1 / rowHeight) * height

    let targetX = Math.trunc((e.clientX - rel.x) / snapX) * snapX
    let targetY = Math.trunc((e.clientY - rel.y) / snapY) * snapY

    // if (Math.trunc(targetX + boxW) > Math.trunc(container.left + width)) {
    //   targetX = Math.trunc(container.left + width - boxW)
    // } else if (Math.trunc(targetX) < 0) {
    //   targetX = 0
    // }
    //
    // if (Math.trunc(targetY + boxH) > Math.trunc(container.top + height)) {
    //   targetY = Math.trunc(container.top + height - boxH)
    // } else if (Math.trunc(targetY) < 0) {
    //   targetY = 0
    // }

    // TODO: detect if element touch container on resizing
    // if (Math.trunc(targetX / snapX) >= cols) {
    //   targetX = cols
    // } else if (Math.trunc(targetX / snapX) < 1) {
    //   targetX = 1
    // }
    //
    // if (Math.trunc(targetY / snapY) >= rowHeight) {
    //   targetY = rowHeight
    // } else if (Math.trunc(targetY / snapY) < 1) {
    //   targetY = 1
    // }

    let updateChild = update(child, {
      props: {
        // box: {
        //   [breakpoint]: {
        //     w: {
        //       $set: Math.trunc(targetX / snapX)
        //     },
        //     h: {
        //       $set: Math.trunc(targetY / snapY)
        //     }
        //   }
        // }
        style: {
          width: {
            $set: `${e.clientX - rel.x}px`
          },
          height: {
            $set: `${e.clientY - rel.y}px`
          }
        }
      }
    })

    let updateTarget = update(target, {
      props: {
        box: {
          [breakpoint]: {
            w: {
              $set: Math.trunc(targetX / snapX)
            },
            h: {
              $set: Math.trunc(targetY / snapY)
            }
          }
        },
        style: {
          transition: {
            $set: 'width ease-out .1s'
          },
          width: {
            $set: `${targetX}px`
          },
          height: {
            $set: `${targetY}px`
          },
          background: {
            $set: 'lightblue'
          }
        }
      }
    })

    this.setState(state => ({
      target: updateTarget,
      boxes: update(state.boxes, {
        [selected]: {
          $set: updateChild
        }
      })
    }))
  }

  endResizeBox = () => {
    const { cols, rowHeight } = this.props
    const { target, boxes, selected, width, height, breakpoint } = this.state
    const { box, onResizeEnd } = target.props
    const child = boxes[selected]

    let boxW = (box[breakpoint].w / cols) * width
    let boxH = (box[breakpoint].h / rowHeight) * height

    let updateChild = update(child, {
      props: {
        box: {
          $set: box
        },
        style: {
          opacity: {
            $set: 1
          },
          width: {
            $set: `${boxW}px`
          },
          height: {
            $set: `${boxH}px`
          }
        }
      }
    })

    this.setState(state => ({
      target: null,
      boxes: update(state.boxes, {
        [selected]: {
          $set: updateChild
        }
      })
    }), () => {
      if (onResizeEnd && typeof onResizeEnd === 'function') {
        onResizeEnd(box)
      }
    })
  }

  initResizeEvent = () => {
    if (isTouchDevice()) {
      document.addEventListener('touchmove', this.onResizeBox, {
  			passive: false
  		})
  		document.addEventListener('touchend', this.onEndResizeBox, {
  			passive: false
  		})
    } else {
      document.addEventListener('mousemove', this.onResizeBox, false)
      document.addEventListener('mouseup', this.onEndResizeBox, false)
    }
  }

  removeResizeEvent = () => {
    if (isTouchDevice()) {
      document.removeEventListener('touchmove', this.onResizeBox)
  		document.removeEventListener('touchend', this.onEndResizeBox)
    } else {
      document.removeEventListener('mousemove', this.onResizeBox)
      document.removeEventListener('mouseup', this.onEndResizeBox)
    }
  }

  render() {
    const { height } = this.state
    const { isStatic, className } = this.props

    return (
      <ResizeAware
        style={{ position: 'relative' }}
        onlyEvent
        onResize={this.onSizeChangeContainer}
      >
        <div
          className={className || 'container'}
          ref={el => this.containerRef = el}
          style={{
            minHeight: height,
          }}
        >

          {this.state.boxes}
          {this.state.target}

        </div>
        {
          !isStatic
            ? (
              <span
                className='container-resizer left-bottom'
                onMouseDown={this.onStartResizeContainer}
                onTouchStart={this.onStartResizeContainer} />
            )
            : null
        }
      </ResizeAware>
    )
  }
}

ReactGridResponsive.propTypes = {
  onChange: PropTypes.func,
  onBreakpointChange: PropTypes.func,
  onWidthChange: PropTypes.func,

  breakpoints: PropTypes.object,
  cols: PropTypes.number,
  rowHeight: PropTypes.number,
  height: PropTypes.number,
  isStatic: PropTypes.bool
}

ReactGridResponsive.defaultProps = {
  onChange: undefined,
  onBreakpointChange: undefined,
  onWidthChange: undefined,

  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: 12,
  rowHeight: 30,
  height: 400,
  isStatic: false
}

export default ReactGridResponsive
