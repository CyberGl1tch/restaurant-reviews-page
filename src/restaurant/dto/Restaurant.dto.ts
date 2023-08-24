import {IsEmail, IsInt, IsNotEmpty, MinLength} from "class-validator";
import {StoreCategories} from "../../Enums/StoreCategories";

export class RestaurantDto {

    @IsNotEmpty({message: "Address must be specified"})
    address: string;
    
    @IsNotEmpty({message: "lat must be specified"})
    lan: string;
    
    @IsNotEmpty({message: "lon must be specified"})
    lon: string;
    
    @IsNotEmpty({message: "Phone number must be specified"})
    phone: string;

    category?: StoreCategories;

    image_url?: string

    @IsNotEmpty({message: "Name must be specified"})
    name: string;

    description: string;
}
