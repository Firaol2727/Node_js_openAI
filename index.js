import OpenAI from "openai";
import dotenv from 'dotenv';
import Excel from "xlsx";
import * as fs from "fs";
import express from "express";
import upload from "./helper/FileHelper.js";
const app=express();
const PORT=process.env.PORT||7000
dotenv.config();
const openai = new OpenAI({
    apiKey:process.env.CHAT_GPT_API_KEY
});

async function writeName(names){
  const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', 
    content: 'You convert the names given by the user to amharic and return in the array  form example input ["Abebe Debela lemi","Kebede aster aman"] your response will be ["አበበ ደበላ ለሚ","ከበደ አስቴር አማን"] ' },
    { role: 'user', content: names.toString()},
  ],
  })
  // console.log("The name written English ",completion.choices[0].message.content)
  return completion.choices[0].message.content;
}


async function ConvertNamesToAmharic(data) {
  let names=[];
  const length=data.length;
  let translated_names=[];
  let name=data[1][0];
  console.log("name",name)
  names.push(name)
  for (let index = 1; index <length;index++) {
    if (name!=data[index][0]) {
      names.push(data[index][0])
      name=data[index][0];
    }
  }
  const names_length=names.length;
  console.log("name",names)
  
  console.log("Names ",names_length);
  let i=0;
  while (i<names_length) {
    console.log("shrink ",i)
    let shrinkedNames;
    if(i+30<names_length){
      shrinkedNames=names.slice(i,i+31)
    }
    else{
      shrinkedNames=names.slice(i,names_length)
    }
    let converted_names=await writeName(shrinkedNames);
    translated_names.push(converted_names);
    i=i+30;
    // console.log("Converted Names",converted_names);
  }
  return translated_names;
}

async function writeAdvisory(jsonData) {
  try {
  let json_advisory=[["Name","Amharic SMS","AfaanOromo"]];
  const length=jsonData.length;
  let amharic_names= await ConvertNamesToAmharic(jsonData);
  console.log("The Amharic names length is ",amharic_names.length);
  new_json[0].push("Amharic Sms ")
  let amharic_names_length=amharic_names.length;
  let name=new_json[1][0];
  let name_index=1;
  json_advisory.push([
    name,
    `ይህ መልዕክት ለ አቶ / ወ/ሮ  -${amharic_names[0]}ነው። ለአንድ ሄክታር  መሬት / ማሳ/ የሚያስፈልገው  ኤንፒስ መጠን ${new_json[1+1][12]} ኪ.ግ ፣ የዩሪያ መጠን  ${new_json[1+4][12]}ኪ.ግ እና የኮምፖስት መጠን  ${new_json[1+5][13]} ኩንታል ነው። በመሆኑም ይህን የማዳበሪያ መጠን በመጠቀም ምርትዎን እንዲያሳድጉ ስንል እናሳስባለን። ይህ መልዕክት በለርሻ፣ በአሊያንስ ባዮቨርሲቲ እና በሲያት ትብብርየቀረበ ነው። ለተጨማሪ መረጃ 7860 ይደዉሉ።`,
    `Ergaan kun Obbo ${new_json[1+1][0]}Mohammedamin Abdalla Ale. lafa hektaara tokkof Hamma 
    maasa keessaniif barbaachisu NPS ${new_json[1+1][12]} kg, hamma Yuuriyaa  ${new_json[1+4][12]}  kg fi hamma kompostii ${new_json[1+5][13]}  kuntal. 
    Kanaaf xaa'oo hamma kana fayyadamuun oomisha keessan  akka guddistan issin Hubachifnaa Ergaan kun walta'iinsa Lersha, 
    Alliance Bioversity fi CIAT  gidduutti taasifameedha. Odeeffannoo dabalataaf 7860  iratti bilbilaa.
    `
  ])
  for (let index = 1; index <length;index++) {
    
    if (name!=new_json[index][0]) {
      console.log("index " ,index)
      let translated='';
      let message_text=''
      if(name_index<amharic_names_length){
        translated=amharic_names[name_index];
        message_text=`ይህ መልዕክት ለ አቶ / ወ/ሮ  -${amharic_names[name_index]} ነው። ለአንድ ሄክታር  መሬት / ማሳ/ የሚያስፈልገው  ኤንፒስ መጠን ${new_json[index+1][12]} ኪ.ግ ፣ የዩሪያ መጠን  ${new_json[index+4][12]}ኪ.ግ እና የኮምፖስት መጠን  ${new_json[index+5][13]} ኩንታል ነው። በመሆኑም ይህን የማዳበሪያ መጠን በመጠቀም ምርትዎን እንዲያሳድጉ ስንል እናሳስባለን። ይህ መልዕክት በለርሻ፣ በአሊያንስ ባዮቨርሲቲ እና በሲያት ትብብርየቀረበ ነው። ለተጨማሪ መረጃ 7860 ይደዉሉ።`
      }
      console.log("Text ",message_text)
      json_advisory.push([
        translated,
        message_text,
    `Ergaan kun Obbo ${new_json[index+1][0]}. lafa hektaara tokkof Hamma 
    maasa keessaniif barbaachisu NPS ${new_json[index+1][12]}kg, hamma Yuuriyaa  ${new_json[index+4][12]}  kg fi hamma kompostii ${new_json[index+5][13]}  kuntal. 
    Kanaaf xaa'oo hamma kana fayyadamuun oomisha keessan  akka guddistan issin Hubachifnaa Ergaan kun walta'iinsa Lersha, 
    Alliance Bioversity fi CIAT  gidduutti taasifameedha. Odeeffannoo dabalataaf 7860  iratti bilbilaa.
    `
      ])
      name=new_json[index][0]

      // new_json[index].push(message_text);
      name_index++;
    }
  }
    const file_name=writeExcel(json_advisory);
    return file_name;
        
  } catch (error) {
    throw new Error("Error while converting ")
  }
  }
// ConvertNamesToAmharic(jsonData);
async function writeExcel(data){
// Create a worksheet
  // console.log("Converted Excel")
  // for (let index = 0; index < 7; index++) {
  //   console.log(data[index]);
  // }
  const ws = Excel.utils.json_to_sheet(data);

  // Create a workbook
  const wb = Excel.utils.book_new();
  Excel.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Convert the workbook to a binary Excel file
  const excelBuffer = Excel.write(wb, { bookType: 'xlsx', type: 'buffer' });
  const file_name=`${moment().unix()}-converted.xlsx`;
  // Save the buffer to a file
  fs.writeFileSync(`advisoryConverted/${file_name}`, excelBuffer);
  return file_name;
}
app.post("/uploadFile",upload.single("excel"),async(req,res)=>{
  console.log(req.file);
  const workbook = Excel.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = Excel.utils.sheet_to_json(worksheet, { header: 1 });
  let new_json=jsonData;
  const length=jsonData.length;
  try {
    let file_path=await writeAdvisory(jsonData)
    res.sendFile(`./advisoryConverted/${file_path}`);
  } catch (error) {
    res.status(400).send("Some thing went Wrong !");
  }
})
// writeExcel()
// writeAdvisory();

app.listen(PORT,()=>{
  console.log(`The Server has started running on port ${PORT}!`);
})