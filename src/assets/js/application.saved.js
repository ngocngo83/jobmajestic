const apply = new Toggle('.apply', {
    onOn: (btn) => {
        btn.innerHTML = '<i class="fas fa-envelope"></i> Applied';
        apply.disable(btn);
    },
    onOff: (btn) => {
        btn.innerHTML = '<i class="far fa-envelope"></i> Apply Now</a>';
    },
    onWait: (btn) => {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    },
    success: (btn) => {
        $.ajax({
            type: 'get',
            url: node.dataset.url,
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                if (res.status == 'success') {
                    if (res.action == 'add') {
                        apply.triggerOn(btn);
                    } else if (res.action == 'delete') {
                        apply.triggerOff(btn);
                    }
                }
            }
        });
    }
});

const bookmark = new Toggle('.bookmark', {
    onOff: (btn) => {
        btn.innerHTML = '<i class="far fa-bookmark"></i> Save';
        btn.closest('.card').remove();
    },
    onWait: (btn) => {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    },
    success: (btn) => {
        $.ajax({
            type: 'get',
            url: btn.dataset.url,
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                if (res.status == 'success') {
                    if (res.action == 'add') {
                        //bookmark.triggerOn(btn);
                    } else if (res.action == 'delete') {
                        bookmark.triggerOff(btn);
                    }
                }
            }
        });
    }
});