const mainApplied = new Toggle('.main-apply', {
    onOn: (btn) => {
        btn.innerHTML = '<i class="fas fa-envelope"></i> Applied';
        mainApplied.disable(btn);
    },
    onOff: (btn) => {
        btn.innerHTML = '<i class="far fa-envelope"></i> Apply Now';
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
                        mainApplied.triggerOn(btn);
                    } else if (res.action == 'delete') {
                        mainApplied.triggerOff(btn);
                    }
                }
            }
        });
    }
});

const bookmark = new Toggle('.bookmark', {
    onOn: (btn) => {
        btn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
    },
    onOff: (btn) => {
        btn.innerHTML = '<i class="far fa-bookmark"></i> Save';
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
                        bookmark.triggerOn(btn);
                    } else if (res.action == 'delete') {
                        bookmark.triggerOff(btn);
                    }
                }
            }
        });
    }
});