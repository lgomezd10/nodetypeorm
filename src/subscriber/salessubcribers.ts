
import { getRepository, RemoveEvent } from "typeorm";
import { EventSubscriber } from "typeorm/decorator/listeners/EventSubscriber";
import { EntitySubscriberInterface } from "typeorm/subscriber/EntitySubscriberInterface";
import { InsertEvent } from "typeorm/subscriber/event/InsertEvent";
import { Product } from "../entity/Product";
import { Sale } from "../entity/Sale";

@EventSubscriber()
export class SaleSubscriber implements EntitySubscriberInterface<Sale> {


    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo() {
        return Sale;
    }

    /**
     * Called before post insertion.
     */
    
     async afterInsert(event: InsertEvent<Sale>) {
        console.log(`BEFORE POST INSERTED: `, event.entity);
        const productRepository = getRepository(Product);

        try {
            let product = await productRepository.findOneOrFail({where: { id: event.entity.product.id}});
            if ((product.stock - event.entity.quantity) < 0) 
                product.stock = 0
            else            
                product.stock = product.stock - event.entity.quantity;
            productRepository.save(product);
        } catch (error) {
            console.log("Error al actualizar el stock", error);
        }
        
    }

    async afterRemove(event: RemoveEvent<Sale>) {
        console.log(`BEFORE POST INSERTED: `, event.entity);
        const productRepository = getRepository(Product);

        try {
            let product = await productRepository.findOneOrFail(event.entity.productId);
                     
            product.stock = product.stock + event.entity.quantity;
            productRepository.save(product);
        } catch (error) {
            console.log("Error al actualizar el stock", error);
        }
        
    }

}