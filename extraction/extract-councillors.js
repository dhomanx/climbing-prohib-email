const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Define file paths relative to the script location
const htmlFilePath = path.resolve(__dirname, 'all-councillors.html');
const localCsvPath = path.resolve(__dirname, 'local.csv');
const otherCsvPath = path.resolve(__dirname, 'other.csv');

try {
    // Read the HTML file
    const html = fs.readFileSync(htmlFilePath, 'utf8');

    const $ = cheerio.load(html);
    const localCouncillors = [];
    const otherCouncillors = [];

    const csvHeader = 'Surname,Email';

    $('.councillors-group').each((i, group) => {
        const groupName = $(group).find('.heading-h3').first().text().trim();
        const isLocalGroup = groupName === 'Dún Laoghaire (7)';

        $(group).find('.councillors-section--item').each((j, item) => {
            const nameElement = $(item).find('.tw-font-bold.tw-text-lg.tw-mb-3');
            const fullName = nameElement.text().trim();
            const email = $(item).find('.tw-inline-block.tw-underline').text().trim();

            if (fullName && email) {
                // Remove "Councillor " or "Councillors " prefix and get the last word as surname
                const nameWithoutTitle = fullName.replace(/^Councillor(s)?\s+/, '');
                const nameParts = nameWithoutTitle.split(' ');
                const surname = nameParts[nameParts.length - 1];

                // Format as "Surname, email" as per the example
                const csvRow = `${surname}, ${email}`;
cd 
                if (isLocalGroup) {
                    localCouncillors.push(csvRow);
                } else {
                    otherCouncillors.push(csvRow);
                }
            }
        });
    });

    // Write to local.csv
    fs.writeFileSync(localCsvPath, [csvHeader, ...localCouncillors].join('\n'), 'utf8');
    console.log(`Successfully created local.csv with ${localCouncillors.length} entries.`);

    // Write to other.csv
    fs.writeFileSync(otherCsvPath, [csvHeader, ...otherCouncillors].join('\n'), 'utf8');
    console.log(`Successfully created other.csv with ${otherCouncillors.length} entries.`);

} catch (err) {
    console.error('An error occurred while running the script:', err);
}