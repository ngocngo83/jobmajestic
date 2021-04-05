let $dob = new Datepicker('#dob', {yearRange: 60});

const copyLanguage = new Copy({
    addBtn: '#addLang',
    removeBtn: '.remove-lang',
    target: '.copy-lang-row',
    max: 5
});

const copySkill = new Copy({
    addBtn: '#addSkill',
    removeBtn: '.remove-skill',
    target: '.copy-skill-row',
    max: 20
});

const copyEducation = new Copy({
    addBtn: '#addEdu',
    removeBtn: '.remove-edu',
    target: '.copy-edu-row',
    max: 3,
    prepend: true
});

const workingHere = (node) => {
    const w = node.querySelector('.working-here')
    if (w) {
        const nodes = node.querySelectorAll('.to-month,.to-year');
        nodes.forEach(node => {
            node.disabled = w.checked;
        });
        w.addEventListener('change', function (e) {
            nodes.forEach(node => {
                node.disabled = e.currentTarget.checked;
            });
        })
    }
}

const expNodes = document.querySelectorAll('.copy-exp-row');
expNodes.forEach(node => {
    workingHere(node);
});

const copyExperience = new Copy({
    addBtn: '#addExp',
    removeBtn: '.remove-exp',
    target: '.copy-exp-row',
    max: 30,
    prepend: true,
    afterAdd: workingHere
});