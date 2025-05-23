var mobile=window.matchMedia("(max-width: 750px)").matches;
var monitor=window.matchMedia("(min-width: 992px)").matches;

const blogEntries=document.querySelectorAll('.blogEntry');
blogEntries.forEach(element => {
    element.style.display='none';
});
const cards=document.querySelectorAll('.card');
cards.forEach(element =>{
    const link = element.querySelector('a').href;
element.addEventListener('click',  (e)=>{
    e.preventDefault();
    displaySingleBlog(link);
});
});

function displaySingleBlog(id){
    id=id.split('#')[1];
    blogEntries.forEach(element => {
    element.style.display='none';
});
    blogEntries.forEach(blog =>{
if(blog.id ===id){ 
    blog.style.display='block';
   blog.scrollIntoView({ behavior: 'smooth' });
}
    });
        
    
}
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('from') === 'seeMore') {
    const hash = window.location.hash;
    if (hash) {
        displaySingleBlog(hash);
    }
}

const toTopButton=document.querySelector('.toTopButton');
toTopButton.addEventListener('click',()=>{
  window.scrollTo(0, 0);
})

const cardButton=document.querySelector('.cardButton');
const listButton=document.querySelector('.listButton');
const blogGrid=document.querySelector('.BlogGrid');
cardButton.addEventListener('click',()=>{
    cards.forEach(element => {
        element.classList='card';
    });
    blogGrid.classList='BlogGrid';
})

listButton.addEventListener('click',()=>{
    cards.forEach(element => {
        element.classList='cardListMode';
       
    
    });
    blogGrid.classList='BlogGrid BlogGridListMode';
})