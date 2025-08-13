# Councillor Email Campaign Tool

This project contains two Node.js scripts to assist with a local email campaign targeting councillors.

1.  **Extractor**: Scrapes councillor contact details (surname and email) from an HTML segment and saves them into CSV files.
2.  **Sender**: Sends personalized bulk emails to a list of recipients from a CSV file using a GMail account.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v12 or higher)
*   An active GMail account with an [App Password](https://support.google.com/accounts/answer/185833) enabled.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dhomanx/climbing-prohib-email.git
    cd climbing-prohib-email
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    open the `.env` file and add your details:
    ```dotenv
    GMAIL_USER=your-email@gmail.com
    GMAIL_APP_PASSWORD=your-16-character-app-password
    SENDER_NAME="Your Name"
    ```

## Usage

The project is split into two main functions: extracting councillor data and sending emails.

### 1. Extracting Councillor Data - if you need to extract DIFFERENT data for other constituencies

This script scrapes councillor data from `extraction/all-councillors.html` and creates two CSV files: `extraction/local.csv` and `extraction/other.csv`.

*   **Input**: `extraction/all-councillors.html` - The source HTML file containing councillor information.
*   **Output**:
    *   `extraction/local.csv`: Contains councillors from the 'Dún Laoghaire (7)' group.
    *   `extraction/other.csv`: Contains all other councillors.

To run the extraction script:
```bash
npm run extract
```
This will generate/overwrite the CSV files in the `extraction` directory.

### 2. Sending Emails

This script sends a personalized email to each person listed in a CSV file.

#### Preparation

Before running the sender script, you need to:

1.  **Prepare the recipient list:** The script is hardcoded to read from `tds.csv` in the project root. You will need to create this file. You can rename or copy one of the generated files (`local.csv` or `other.csv`) or create a custom one. The CSV file **must** have `Surname` and `Email` columns.

2.  **Prepare the email template:** The script uses `tds.html` as the email body. You can modify this file to change the content of the email. The placeholder `[Surname]` will be replaced with the councillor's surname from the CSV.

3.  **Update your personal details:** Open the `tds.html` file and replace the placeholder `NAME`, `ADDRESS`, `EMAIL`, and `PHONE` at the bottom with your own information.

4.  **(Optional) Update email subject:** The email subject is hardcoded in `send-emails.js`.

    ```javascript
    // in send-emails.js
    const emailSubject = 'Your Email Subject Here';
    ```

#### Running the script

Once you have prepared `tds.csv` and `tds.html`, run the following command to start sending emails:

```bash
npm run send
```

The script will log its progress to the console, indicating whether each email was sent successfully.
