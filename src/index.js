
import * as d3 from 'd3'
import 'modern-normalize'
import '@accurat/tachyons-lite'
import 'tachyons-extra'
import './reset.css'
import './style.css'



const svgWidth = 1000;
const svgHeight = 450;

let dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
        11, 12, 15, 20, 28, 17, 16, 18, 23, 25 ];

const maxValue = 50;



const xScale = d3.scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, svgWidth])
      .paddingInner(0.05);

const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([0, svgHeight]);

const mainSvg = d3.select("#root")
      .append("svg")
      .attr("id", "mainSvg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
const addRandomValue = d3.select("#root")
      .append("button")
      .attr("id", "addRandomValue")
      .text("Add value!")
      
const randomizeButton = d3.select("#root")
      .append("button")
      .attr("id", "randomizeButton")
      .text("Shuffle!")



const createBarsAndLabels = () => {

    //Create rectangles
    mainSvg.selectAll("rect")
    .data(dataset)
    .join("rect")
    .transition()
    .duration(500)
    .attr("x", (d, i) =>  {
      return xScale(i);
    })
    .attr("y", (d) => {
      return svgHeight - yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => {
      return yScale(d);
    })
    .attr("fill", (d) => {
      return "rgb(0, 0, " + Math.round(d * 5) + ")";
    });

    //Create labels
    mainSvg.selectAll("text")
    .data(dataset)
    .join("text")
    .transition()							
    .duration(500)
    .text((d) => {
      return d;
    })
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => {
      return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", (d) => {
      return svgHeight - yScale(d) + 14;
    })
    .attr("font-family", "arial")
    .attr("font-size", "12px")
    .attr("fill", "white");
}



let newNumber;
  
//Add new random data			
d3.select("#addRandomValue")
  .on("click", () => {
    
    newNumber = Math.floor(Math.random() * maxValue);	
    dataset.push(newNumber);			 			 		
    
    //Update scale domains
    xScale.domain(d3.range(dataset.length));	
    yScale.domain([0, d3.max(dataset)]);		

    createBarsAndLabels();
  })


//Randomize data
d3.select("#randomizeButton")
  .on("click", () => {

    dataset.forEach((datum, index)=> {
      newNumber = Math.floor(Math.random() * maxValue);	
      dataset[index] = newNumber;
    })

    yScale.domain([0, d3.max(dataset)]);	
    createBarsAndLabels();
  })


createBarsAndLabels();

