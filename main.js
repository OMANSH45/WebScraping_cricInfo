let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request=require("request");
let cheerio=require("cheerio");
let statsObj=require("./stats");

request(url,cb1);

function cb1(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        getHtml(html);
    }
}

function getHtml(html){

    let searchTool=cheerio.load(html);

    let elemRep=searchTool(".custom-scroll .navbar-nav a");

    let link=searchTool(elemRep[1]).attr("href");
    let fullLink="https://www.espncricinfo.com"+link;

    request(fullLink,cb2);

}
function cb2(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        getScorecard(html);
    }
}
function getScorecard(html){
    let searchTool=cheerio.load(html);

    let matches=searchTool(".col-md-8.col-16");

    for(let i=0;i<matches.length;i++){
        let match=searchTool(matches[i]).find("a");

        let matchScore=searchTool(match[1]);
        let link=matchScore.attr("href");
        let fullLink="https://www.espncricinfo.com"+link
        
        statsObj.processSinglematch(fullLink);


    }

}




    






