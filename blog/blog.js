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

const toTopButton=document.querySelector('.toTopButton');
toTopButton.addEventListener('click',()=>{
  window.scrollTo(0, 0);
})