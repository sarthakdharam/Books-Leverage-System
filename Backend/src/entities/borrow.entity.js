const { EntitySchema }=require('typeorm')



const Borrow=new EntitySchema({
    name:'BorrowRecord',
    tableName:'borrow_records',
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true,
        },
        borrow_date:{
            type:"timestamp",
            createDate: true,
        },
        due_date:{
            type:'timestamp',
        },
        return_date:{
            type:'timestamp',
            nullable:true,
        },
        fine_amount:{
            type:'int',
            default:0,
        },

        status:{
            type:'varchar',
            default:'borrowed'
        },
                       
    },
    relations:{
        user:{
            type:'many-to-one',
            target:'User',
            joinColumn:{ name:'user_id'},
            onDelete:'CASCADE',
        },
        book:{
            type:'many-to-one',
            target:'Book',
            joinColumn:{name:'book_id'},
            onDelete:'CASCADE',
        },
        librarian:{
            type:'many-to-one',
            target:'librarian',
            joinColumnL:{name: 'librarian_id'},
            onDelete:'SET NULL',
            nullable:true
        }
    }
});
module.exports = {Borrow};