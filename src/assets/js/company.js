const form = new JaxForm('#filterCompanyForm', {
    container: '#results',
    nextBtn: '#next',
    loadingIndicator: '#loading',
    endIndicator: '#end',
    xhr: true,
    request: function (f, page) {
        $.ajax({
            type: f.formAttribute('method'),
            url: f.formAttribute('action') + '/' + page,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(f.formData(true)),
            success: function (res) {
                if (res.status === 'success') {
                    document.querySelector('#total').innerHTML = res.total_records;
                    f.setMaxPerPage(res.max_per_page);
                    f.addContent(res.content, res.total_records);
                }
            }
        });
    }
});