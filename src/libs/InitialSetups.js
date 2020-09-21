import Role from '../models/Role';

export const RoleSeeder = async () => {
  try {

    const CountRoles = await Role.estimatedDocumentCount();
    if(CountRoles > 0) return
    
    const Seeder = await Promise.all([
      new Role({ name: 'USER_ROLE' }).save(),
      new Role({ name: 'PARNERTH_ROLE' }).save(),
      new Role({ name: 'ADMIN_ROLE' }).save(),
    ]);

    console.log({Roles: Seeder});
    
  } catch (error) {
    console.log(error);
  }
};