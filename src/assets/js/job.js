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
            url: btn.dataset.url,
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

const apply = new Toggle('.apply', {
    onOn: (btn) => {
        btn.innerHTML = '<i class="fas fa-envelope"></i> Applied';
        apply.disable(btn);
    },
    onOff: (btn) => {
        btn.innerHTML = '<i class="far fa-envelope"></i> Apply';
    },
    onWait: (btn) => {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    },
    success: (btn) => {

    }
});

const form = new JaxForm('#filterJobForm', {
    container: '#results',
    nextBtn: '#next',
    loadingIndicator: '#loading',
    endIndicator: '#end',
    xhr: true,
    request: function (f, page) {

    }
});