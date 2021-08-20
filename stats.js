let fs=require("fs");
let path=require("path");
let xlsx=require("xlsx");

let request=require("request");
let cheerio=require("cheerio");



function processSinglematch(url){
    request(url,cb3);

}

function cb3(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        getStats(html);
    }
}

function getStats(html){
    let searchTool=cheerio.load(html);
    //ipl folder
    let folderPath=path.join("C:\\Users\\omansh\\Desktop\\cricInfo\\"+"ipl");
    if(fs.existsSync(folderPath)==false){
        fs.mkdirSync(folderPath);
    }

    let teams=searchTool(".Collapsible");
    let detail=searchTool(".description").text().split(",");
    venu=detail[1].trim();
    let date=detail[2].trim();
    let result=searchTool(".match-info span");
    result=searchTool(result[result.length-1]).text();
    
    
    //team1 Name
    let t1=searchTool(teams[0]).text();
    t1Name=t1.split("INNINGS")[0].trim();

    //team2 Name
    let t2=searchTool(teams[1]).text();
    t2Name=t2.split("INNINGS")[0].trim();
    
    //team1 folder
    let t1Folder=path.join(folderPath,t1Name);
    if(fs.existsSync(t1Folder)==false){
        fs.mkdirSync(t1Folder);
    }

    //t1 players->batsman files

    let t1Players=searchTool(teams[0]).find(".table.batsman tbody tr");
    
    for(let i=0;i<t1Players.length;i++){
        let noOfTd=searchTool(t1Players[i]).find("td");
        
        let opponentTeamName=t2Name;

        if(noOfTd.length==8){
            let playerName=searchTool(noOfTd[0]).text().trim();
            let runs=searchTool(noOfTd[2]).text().trim();
            let balls=searchTool(noOfTd[3]).text().trim();
            let fours=searchTool(noOfTd[5]).text().trim();
            let sixes=searchTool(noOfTd[6]).text().trim();
            let sr=searchTool(noOfTd[7]).text().trim();

            let location=path.join(t1Folder,playerName+".xlsx");

        let content=excelReader(location,playerName);
        let dataObj=contentRead(t1Name,playerName,venu,date,opponentTeamName,result,runs,balls,fours,sixes,sr);
        content.push(dataObj);
        excelWriter(content,location,playerName);
        //let jsonData=JSON.parse(dataObj);
        // let jsonWrite=JSON.stringify(jsonData);
        // if(fs.existsSync(location)==false){
        //     fs.writeFileSync(location,jsonWrite+",\n");
        // }else{
        //     fs.appendFileSync(location,jsonWrite+",\n");
        // }

        }
    }
    let t2Folder=path.join(folderPath,t2Name);
    if(fs.existsSync(t2Folder)==false){
        fs.mkdirSync(t2Folder);
    }

    //t2 players->batsman files

    let t2Players=searchTool(teams[1]).find(".table.batsman tbody tr");
    for(let i=0;i<t2Players.length;i++){
        let noOfTd=searchTool(t2Players[i]).find("td");
        
        let opponentTeamName=t1Name;
        
        
        if(noOfTd.length==8){
            let playerName=searchTool(noOfTd[0]).text().trim();
            let runs=searchTool(noOfTd[2]).text().trim();
            let balls=searchTool(noOfTd[3]).text().trim();
            let fours=searchTool(noOfTd[5]).text().trim();
            let sixes=searchTool(noOfTd[6]).text().trim();
            let sr=searchTool(noOfTd[7]).text().trim();

            let location=path.join(t2Folder,playerName+".xlsx");

        let content=excelReader(location,playerName);
        let dataObj=contentRead(t2Name,playerName,venu,date,opponentTeamName,result,runs,balls,fours,sixes,sr);
        content.push(dataObj);
        excelWriter(content,location,playerName);

        //let jsonData=JSON.parse(dataObj);
        // let jsonWrite=JSON.stringify(jsonData);
        // if(fs.existsSync(location)==false){
        //     fs.writeFileSync(location,jsonWrite+",\n");
        // }else{
        //     fs.appendFileSync(location,jsonWrite+",\n");
        // }

        }
        
    }
}
function contentRead(teamName,playerName,venu,date,opponentTeamName,result,runs,balls,fours,sixes,sr){
    let data={
        "teamName":teamName,
        "playerName":playerName,
        "venu":venu ,
        "date":date,
        "opponentTeamName":opponentTeamName,
        "result":result,
        "runs":runs,
        "balls":balls,
        "fours":fours,
        "sixes":sixes,
        "sr":sr
    }
    
    return data;
}
function excelWriter(jsonData,location,playerName){
    let newWb=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWb,newWS,playerName);
    xlsx.writeFileSync(newWb,location);
}
function excelReader(location,sheetName){
    if(fs.existsSync(location)==false){
        return [];
    }
    let wb=xlsx.readFile(location);
    let excelData=wb.Sheets[sheetName];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;

}
module.exports={
    processSinglematch
}
    