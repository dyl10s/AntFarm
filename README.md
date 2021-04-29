# AntFarm Simulator Project

A live version of the project can be found [here](https://ant-farm.vercel.app/).

## About

This ant farm simulator is a proof of concept for simulating ant digging. There are a plethora of ant farm simulations that explore the food collection that ants do but not much out there that has to do with the digging. Turns out this is a lot trickier than we originally expected. Just digging a simple nest requires some decently advanced algorithms and pathfinding. The simulation also has a custom sand engine that simulates every pixel on the screen. We believe that this project has created a good baseline that could be explored further in the future. 

## Demo
Click Gif For Full Quality Video

[![Demo](https://user-images.githubusercontent.com/12243691/116593025-a773d080-a8ee-11eb-8bff-d507f6febfdc.gif)](https://drive.google.com/file/d/1eQDom4rqwHkU6m9XuuRpXhmNlQ0V3hBq/view?usp=sharing)

## Technologies

This was build using Phaser a JavaScript based game engine with TypeScript support. We decided to use TypeScript for this project as it's just overall easier to learn new frameworks with code completion as well as giving us the ability to create a nice infrastructure for the simulation. One of the key features of the simulation that is not originally noticeable is the "Sand" engine which was based on the game Noita and other flash-based games. This [video](https://www.youtube.com/watch?v=prXuyMCgbTc) does a great job at explaining the best way to create an engine where every pixel in the world is simulated without compromising any performance. 

## Setup

This project was set up using npm, I specifically and using `6.14.11` due to some limitations of other projects but I am sure newer versions will work as well.

### Steps

#### `npm install` - The first thing you will need to do is install the dependencies by running the `npm install` command.
#### `npm start` - This will run webpack and build the typescript code to the `dist` folder which the `index.html` script references.
#### Finally you can just open up the `index.html` file in your browser. We recommend using the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) vs code extension so you have hot reloading while developing.
