const signUpToggle = new PasswordToggle ('.new-password',{
    onOn: (btn) => {
        btn.classList.add('btn');
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    },
    onOff: (btn) => {
        btn.classList.add('btn');
        btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

const loginToggle = new PasswordToggle ('.current-password',{
    onOn: (btn) => {
        btn.classList.add('btn');
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    },
    onOff: (btn) => {
        btn.classList.add('btn');
        btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

const forms = document.querySelectorAll('.signupform');
forms.forEach(form => {
    form.addEventListener('submit', function(){
        form.signupbtn.disabled = true;
    });
});
