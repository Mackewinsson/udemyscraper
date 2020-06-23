const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const URL =
  'https://www.udemy.com/course/my-google-classroom-google-classroom-made-easy-to-beginners';
const courseName = URL.replace(
  /(https:\/\/www.udemy.com\/course\/)(\w.*)/g,
  '$2'
);
debugger;

(async () => {
  const response = await request(URL);

  const $ = await cheerio.load(response);
  const course = $('h1[class="clp-lead__title "]').text();
  const elements = $('div[class="curriculum-header-container"]').siblings();
  let courseDetails = [];
  // LOOP OVER THE ELEMENTS
  elements.each(function () {
    let title = $(this)
      .find(
        'span[class="section-title-wrapper"] > span[class="section-title-text"]'
      )
      .text();
    let bulletpoints = [];
    let bullets = $(this)
      .find('div.title')
      .each(function () {
        bulletpoints.push($(this).text().replace(/\n/g, ''));
      });

    courseDetails.push({
      section: title,
      bulletpoints,
    });
  });
  let text = '';
  for (let i = 0; i < courseDetails.length; i++) {
    const section = courseDetails[i];
    const sectionName = courseDetails[i].section;
    let bullets = '';
    for (let i = 0; i < section.bulletpoints.length; i++) {
      if (bullets === '') {
        bullets = `-${section.bulletpoints[i]}`;
      } else {
        bullets += `
-${section.bulletpoints[i]}`;
      }
    }
    if (text === '') {
      text = `
${sectionName}
${bullets}
         `;
    } else {
      text += `
${sectionName}
${bullets}
    `;
    }
  }

  fs.writeFile(`${courseName}`, text, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Document Saved');
  });
})();
