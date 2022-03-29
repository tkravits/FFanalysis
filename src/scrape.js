const scrapePersons = async () => {
    // import launchChrome and newPage from the browser.js file in the same directory
    const { launchChrome } = require("./browser");
  
    // Flow 1 => Launching chrome and opening a new tab/page
    const [newPage, exitChrome] = await launchChrome();
    const [page] = await newPage();
  
    // exit the function if the tab is not properly opened
    if (!page) return;
  
    // Flow 2 => Visiting a website's home page
    const url = "https://www.website.com/";
    console.log("Opening " + url);
    try {
      await page.goto(url, {
        waitUntil: "networkidle0", // wait till all network requests has been processed
      });
    } catch(e) {
      console.error("Unable to visit " + url, e);
      await exitChrome(); // close chrome on error
      return; // exiting the function
    }
  
   
  
    await exitChrome(); // close chrome
  };
  
export default scrapePersons;