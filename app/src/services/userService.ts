import supabase from "@/lib/supabase";

export class UserService {
    static async getAllUsers() {
        console.log(process.env.NEXT_PUBLIC_SUPABASE_URL!);
        
        const { data, error } = await supabase
        .from("_users")
        .select("*");


        console.log(data);
        

        return data;
    }
}