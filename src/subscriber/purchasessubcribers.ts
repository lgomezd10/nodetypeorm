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
        const productRepository = getRepository(Product);
        const productId = event.entity.productId || event.entity.product?.id;

        try {
            let product = await productRepository.findOneOrFail(productId);
             product.stock = product.stock + event.entity.quantity;
            productRepository.save(product);
        } catch (error) {
            console.log("Tras error al actualizar un insert de el evento", event);
            console.log("Error al actualizar el stock", error);
        }
        
    }

    
}