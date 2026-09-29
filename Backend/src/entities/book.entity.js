const { EntitySchema }=require('typeorm')



const Book=new EntitySchema({
    name:'Book',
    tableName:'books',
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true,
        },
        book_name:{
            type:'varchar',
            unique: true,
        },
        book_author:{
            type:'varchar'
        },
        total_books:{
            type:'int',
        },
        available_books:{
            type:'int',
        },

        category:{
            type:'varchar',
        },
        created_at:{
            type:'timestamp',
            createDate:true,
        },
        updated_at:{
            type:'timestamp',
            updateDate:true,
        },
        is_active: {
            type: 'boolean',
        },
        book_image: {
            type: 'varchar',
            nullable: false,
        },               
    }
})
module.exports = {Book};