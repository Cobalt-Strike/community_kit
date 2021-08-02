 // Tool Tips
 $(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// Datatables.net table
$(document).ready(function() {

    $('#cckit_table').DataTable( {
        "order": [[ 0, "desc" ]],
        "pageLength": 100,

    ajax: {
        url: 'data.json',
        dataSrc: 'data'
    },
    columns: [
        { data: "pushed_at" },
        { data: "category" },
        { data: "owner.login" },
        { data: "owner.avatar_url" },
        { data: 'name',render: $.fn.dataTable.render.text() },
        { data: 'description', render: $.fn.dataTable.render.text() },
        { data: 'commit_message', render: $.fn.dataTable.render.text() },
        { data: 'stargazers_count'},
        { data: 'has_binary'},
        { data: 'html_url' },
    ],
    columnDefs: [
        {   // Left justify headers
            targets: [ 0, 1, 2, 3, 4, 5, 6 ],
            className: 'dt-body-left'
        },
        {   // Center justify headers
            targets: [ 7, 8, 9 ],
            className: 'dt-body-center'
        },
        {   // Latest commit message
            targets: 6,
            render: function ( data, type, row ) {
                return data;
            }
        },
        // {   // Latest commit message (tooltip)
        //     targets: 6,
        //     render: function ( data, type, row ) {
        //         return '<p data-toggle="tooltip" data-placement="top" title="' + data + '"><i class="fas fa-comment-dots"></i></p>';
        //     }
        // },
        {   // Has Binary Warning
            targets: 8,
            render: function ( data ) {
                if (data == ""){
                    return '';
                } else {
                    return '<p data-toggle="tooltip" data-placement="top" title="' + data + '"><i class="fas fa-exclamation-triangle"></i></p>';
                }
            }
        },
        {   // GitHub Link
            targets: 9,
            render: $.fn.dataTable.render.hyperLink( '<i class="fab fa-github fa-lg"></i>')
        },
        {   // Repo owner avatar
            targets: 3,
            render: function ( data, type, row ) {
                return '<img width=40 height=40 src="'+ data + '" />';
            }
        },
        {   // Time format
            targets: 0,
            // render: function ( data, type, row ) {
            //     return data.substr( 0, 10 );}
            render:function(data){
                // return formated date
                //return moment(data).format('YYYY-MMMM-DD');
                
                // Has this been updated in the last 30 days?
                var d = moment().diff(data, 'days');
                if (d < 30){
                    return moment(data).format('YYYY-MM-DD') + " " + '<i class="fas fa-star fa-lg"></i>';
                    
                } else {
                    return moment(data).format('YYYY-MM-DD');
                }

                //return moment(data).format('DD-MMMM-YYYY');



            }
        }

    ]

    } );

    
} );