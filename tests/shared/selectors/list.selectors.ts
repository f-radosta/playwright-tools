export const listSelectors = {
  list: '//*[@class="wrapper--content"]//tbody',
  item: '//*[@class="wrapper--content"]//tbody//tr',
  deleteButton: '//*[@class="icon-trash"]',
  titles: {
    edit: 'Upravit kategorii',
  },
};


// export const listSelectors = {
//   // Using relative selectors instead of absolute XPaths
//   list: '.wrapper--content tbody',
//   item: 'tr', // This will be used relative to the tbody context
//   deleteButton: '.icon-trash',
//   titles: {
//     edit: 'Upravit kategorii',
//   },
// };