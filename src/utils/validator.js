import _ from 'lodash'

export const isTouchDevice = () => 'ontouchstart' in document.documentElement

export const isEmpty = data => Array.isArray(data) ? !data.length : _.isEmpty(data) || !data

export const includesInArray = (arr, key) => {
  return _.includes(arr, key)
}
