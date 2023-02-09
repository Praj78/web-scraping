const puppeteer =require('puppeteer')
const fs = require('fs')
const data ={
    list:[]
}
async function main(skill){
    const browser=await puppeteer.launch({headless:false})
    const page=await browser.newPage()
    //https://in.indeed.com/jobs?q=fresher&l=Bengaluru%2C+Karnataka
    await page.goto(`https://in.indeed.com/jobs?q=${skill}&l=Bengaluru%2C+Karnataka`,{
        timeout:0,
        waitUntil:'networkidle0'
    })
    const jobData=await page.evaluate(async(data)=>{
        const items =document.querySelectorAll('td.resultContent')
        items.forEach((item,index)=>{
            const title = item.querySelector('h2.jobTitle>a')?.innerText
            const link=item.querySelector('h2.jobTitle>a')?.href
            let salary = item.querySelector('div.etadata salary-snippet-container>div')?.innerText
            const companyName=item.querySelector('span.companyName')?.innerText
            
            if(salary===null){
                salary='not defined'
            }
            data.list.push({
              title,
              salary,
              companyName,
              
              link  
            })
        })
        return data
    },data)
    let response= await jobData
    let json = await JSON.stringify(jobData,null,2)
    fs.writeFile('job.json',json,'utf-8',()=>{
        console.log('written in job.json ')
    })
    browser.close()
    return response
}
// <div class="metadata salary-snippet-container"><div class="attribute_snippet" data-testid="attribute_snippet_testid"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 13" role="presentation" aria-hidden="true" aria-label="Salary"><defs></defs><path fill="#595959" fill-rule="evenodd" d="M2.45168 6.10292c-.30177-.125-.62509-.18964-.95168-.1903V4.08678c.32693-.00053.6506-.06518.95267-.1903.30331-.12564.57891-.30979.81105-.54193.23215-.23215.4163-.50775.54194-.81106.12524-.30237.18989-.62638.19029-.95365H9.0902c0 .3283.06466.65339.1903.9567.12564.30331.30978.57891.54193.81106.23217.23215.50777.41629.81107.54193.3032.12558.6281.19024.9562.1903v1.83556c-.3242.00155-.6451.06616-.9448.19028-.3033.12563-.5789.30978-.81102.54193-.23215.23214-.4163.50774-.54193.81106-.12332.2977-.18789.61638-.19024.93849H3.99496c-.00071-.32645-.06535-.64961-.19029-.95124-.12564-.30332-.30979-.57891-.54193-.81106-.23215-.23215-.50775-.4163-.81106-.54193zM0 .589843C0 .313701.223858.0898438.5.0898438h12.0897c.2762 0 .5.2238572.5.5000002V9.40715c0 .27614-.2238.5-.5.5H.5c-.276143 0-.5-.22386-.5-.5V.589843zM6.54427 6.99849c1.10457 0 2-.89543 2-2s-.89543-2-2-2-2 .89543-2 2 .89543 2 2 2zm8.05523-2.69917v7.10958H2.75977c-.27615 0-.5.2238-.5.5v.5c0 .2761.22385.5.5.5H15.422c.4419 0 .6775-.2211.6775-.6629V4.29932c0-.27615-.2239-.5-.5-.5h-.5c-.2761 0-.5.22385-.5.5z" clip-rule="evenodd"></path></svg>₹20,000 - ₹25,000 a month</div></div>
module.exports =main