<h1> Social Graph - GitHub API </h1>

*Interrogate the GitHub API to build visualisation of data available tht elucidates some aspect of the softare engineering process, such as a social graph of developers and projects, or a visualisation of indiviudal of team performance. Provide a visualisation of this using the d3js library.*
<h3> Implementation </h3>

I used a combination of Javascript (inc. JQuery and D3 libaries), CSS, HTML and Google's Firebase to handle oAuth authentication with GitHub's API. My implentation focuses on two main visulisations:  
1. A force directed graph illustrating a social graph of collaborators of collaborators of your repos
2. Two Donut Pie Charts which illustrate the most common languages across your follower's repos vs the most common languages across your own repos. 

<h3> Usage </h3>

Vist live deployment at https://github-analytics-cs3012.firebaseapp.com

or [follow these steps to install firebase locally](https://firebase.google.com/docs/functions/get-started)

*Note if you continuously use the app over the course of an hour, a GitHub rate limit may be reached, in which case please leave it for an hour before revisiting.* 

<h3> Demo </h3>

![](demo.gif)




