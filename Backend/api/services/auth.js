const { supabase } = require('../../db')

const signupWithEmail = async(user) => {
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
            data: {
                username: user.username,
            },
        },
    });

    const visitor = data.user;
    console.log(visitor);
    // Step 2: Create folder in storage
    const folderPath = `visitors/${visitor.id}/`;
    console.log(folderPath);

    // Supabase doesn’t allow empty folders — we upload a dummy file to "create" it
    const { error: uploadError } = await supabase.storage
        .from('tamulokal')
        .upload(`${folderPath}init.txt`, 'folder initialized', {
            upsert: false,
        });

    console.log(error);
    if (uploadError && uploadError.message !== 'The resource already exists') {
        throw uploadError;
    }

    // Step 3: Get public folder URL
    const { data: publicUrl } = supabase.storage
        .from('tamulokal')
        .getPublicUrl(`${folderPath}init.txt`);

    const folderUrl = publicUrl.publicUrl;

    // Step 4: Update the market row with the folder link
    const { data: updatedVisitor, error: updateError } = await supabase
        .from('visitor')
        .update({ image: folderUrl })
        .eq('id', visitor.id)
        .select();

    if (updateError) throw updateError;

    return data;
}

const signinWithEmail = async (user) => {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
    });

    console.log(data.session)
    return data;
}

const getUser = async(token) => {
    const { data: { user }} = await supabase.auth.getUser(token)

    return data;
}



const signup = async () => {
    const { data, error } = await supabase.auth.signUp({
        email: 'mohdfauzan0506@gmail.com',
        password: 'Mdpojan0506$',
        options: {
            data: {
                username: 'pojan',
            },
        },
    });
}

const signin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'mohdfauzan0506@gmail.com',
        password: 'Mdpojan0506$',
    });
}

const signout = async () => {
    const { error } = await supabase.auth.signOut();
}

module.exports = {
    getUser,
    signinWithEmail,
    signupWithEmail,
    signup,
    signin,
    signout
};