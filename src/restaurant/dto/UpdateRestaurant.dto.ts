import {PartialType} from "@nestjs/mapped-types";
import {ReviewDto} from "../../reviews/dto/Review.dto";
import {RestaurantDto} from "./Restaurant.dto";

export class UpdateRestaurantDto extends PartialType(RestaurantDto) {


}
