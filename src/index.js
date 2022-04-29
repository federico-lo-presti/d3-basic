import * as d3 from 'd3'
import 'modern-normalize'
import '@accurat/tachyons-lite'
import 'tachyons-extra'
import './reset.css'
import './style.css'

const svgWidth = 1000
const svgHeight = 450

let dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 28, 17, 16, 18, 23, 25]

const datasetMaxValue = 50

const margin = { top: 20, right: 20, bottom: 20, left: 40 }

const innerGraphHeight = svgHeight - margin.top - margin.bottom
const innerGraphWidth = svgWidth - margin.left - margin.right

const xScale = d3
  .scaleBand()
  .domain(d3.range(dataset.length))
  .rangeRound([0, innerGraphWidth])
  .paddingInner(0.05)

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0, innerGraphHeight])

const mainSvg = d3
  .select('#root')
  .append('svg')
  .attr('id', 'mainSvg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)

const innerGraph = mainSvg
  .append('g')
  .attr('id', 'innerGroup')
  .attr('transform', `translate(${margin.left}, 0)`)
  .attr('width', innerGraphWidth)
  .attr('height', innerGraphHeight)

const addRandomValue = d3
  .select('#root')
  .append('button')
  .attr('id', 'addRandomValue')
  .text('Add value')

const randomizeButton = d3
  .select('#root')
  .append('button')
  .attr('id', 'randomizeButton')
  .text('Randomize')

const yAxis = d3.axisLeft().scale(yScale)

const yAxisGroup = mainSvg
  .append('g')
  .attr('transform', `translate(${margin.left - 20}, ${margin.top})`)
  .attr('height', innerGraphHeight)
  .call(yAxis)

const createBarsAndLabels = () => {
  //Create rectangles
  innerGraph
    .selectAll('rect')
    .data(dataset)
    .join('rect')
    .on('mouseover', function () {
      d3.select(this).attr('fill', 'orange')
    })
    .on('mouseout', function (_, i) {
      d3.select(this)
        .transition()
        .duration(250)
        .attr('fill', `rgb(0, 0, ${Math.round(i * 5)})`)
    })
    .transition()
    .delay(function (_, i) {
      return (i / dataset.length) * 1000
    })
    .duration(500)
    .attr('x', (_, i) => {
      return xScale(i)
    })
    .attr('y', (d) => {
      return svgHeight - yScale(d) - margin.bottom
    })
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => {
      return yScale(d)
    })
    .attr('fill', (d) => {
      return `rgb(0, 0, ${Math.round(d * 5)})`
    })

  //Create labels
  innerGraph
    .selectAll('text')
    .data(dataset)
    .join('text')
    .transition()
    .delay(function (_, i) {
      return (i / dataset.length) * 1000
    })
    .duration(500)
    .text((d) => {
      return d
    })
    .attr('font-family', 'arial')
    .attr('font-size', '13px')
    .attr('text-anchor', 'middle')
    .attr('x', (_, i) => {
      return xScale(i) + xScale.bandwidth() / 2
    })
    .attr('y', (d) => {
      if (yScale(d) < innerGraphHeight * 0.1) {
        return svgHeight - yScale(d) - margin.bottom - 10
      } else {
        return svgHeight - yScale(d) - margin.bottom + 20
      }
    })
    .attr('fill', (d) => {
      if (yScale(d) < innerGraphHeight * 0.1) {
        return 'black'
      } else {
        return 'white'
      }
    })
    

  yScale.domain([d3.max(dataset), 0])

  yAxisGroup.transition().duration(500).call(yAxis)
}

let newNumber

//Add new random data
d3.select('#addRandomValue').on('click', () => {
  newNumber = Math.floor(Math.random() * datasetMaxValue)
  dataset.push(newNumber)

  //Update scale domains
  xScale.domain(d3.range(dataset.length))
  yScale.domain([0, d3.max(dataset)])

  createBarsAndLabels()
})

//Randomize data
d3.select('#randomizeButton').on('click', () => {
  dataset.forEach((datum, index) => {
    newNumber = Math.floor(Math.random() * datasetMaxValue)
    dataset[index] = newNumber
  })

  yScale.domain([0, d3.max(dataset)])
  createBarsAndLabels()
})

createBarsAndLabels()
