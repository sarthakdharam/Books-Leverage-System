const { EntitySchema }=require('typeorm')


const User=new EntitySchema({
    name:'User',
    tableName:'users',
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true,
        },

        name:{
            type:'varchar',
        },
        username:{
            type:'varchar',
            unique: true,
        },
        email:{
            type:'varchar',
            unique: true,
        },
        phone:{
            type:'varchar',
            length:10,
        },
        password:{
            type:'varchar',
            length:255,
            select:false,
        },
        
        created_at:{
            type:'timestamp',
            createDate:true,
        },
        updated_at:{
            type:'timestamp',
            updateDate:true,
        },
        is_active:{
            type:'boolean',
            default:true,
        },
        user_photo:{
            type:'bytea',
            nullable:true
        }
    },
        relations:{                  
            librarian:{
                type:'many-to-one',
                target:'librarian',
                joinColumn:{name: 'librarian_id'},
                onDelete:'SET NULL',
                nullable:true
            }
        
    }
})
module.exports = {User};