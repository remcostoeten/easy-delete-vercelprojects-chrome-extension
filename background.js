/**
 * Vercel Project Deletion Helper - Background Script
 * Created by Remco Stoeten
 * GitHub: https://github.com/remcostoeten/easy-delete-vercelprojects-chrome-extension
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "parentMenu",
    title: "Vercel Project Deletion Helper",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "builtBy",
    parentId: "parentMenu",
    title: "Built by Remco Stoeten",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "sourceCode",
    parentId: "parentMenu",
    title: "Source Code",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sourceCode") {
    chrome.tabs.create({
      url: "https://github.com/remcostoeten/easy-delete-vercelprojects-chrome-extension"
    });
  }
});