import { getRepository, RemoveEvent } from "typeorm";
import { EventSubscriber } from "typeorm/decorator/listeners/EventSubscriber";
import { EntitySubscriberInterface } from "typeorm/subscriber/EntitySubscriberInterface";
import { InsertEvent } from "typeorm/subscriber/event/InsertEvent";
import { Product } from "../entity/Product";
import { Purchase } from "../entity/Purchase";
import { ItemSale } from "../entity/ItemSale";

@EventSubscriber()
export class PurchasesSubscriber implements EntitySubscriberInterface<Purchase> {


    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo() {
        return Purchase;
    }

    /**
     * Called before post insertion.
     */
    
     async afterInsert(event: InsertEvent<Purchase>) {
        console.log(`BEFORE POST INSERTED PURCHASE: `, event.entity);
        const productRepository = getRepository(Product);

        try {
            let product = await productRepository.findOneOrFail(event.entity.product.id);
             product.stock = product.stock + event.entity.quantity;
            productRepository.save(product);
        } catch (error) {
            console.log("Error al actualizar el stock", error);
        }
        
    }
}