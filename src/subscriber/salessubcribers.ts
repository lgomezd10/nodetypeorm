
import { RemoveEvent } from "typeorm";
import { AppDataSource } from "../data-source";
import { EventSubscriber } from "typeorm/decorator/listeners/EventSubscriber";
import { EntitySubscriberInterface } from "typeorm/subscriber/EntitySubscriberInterface";
import { InsertEvent } from "typeorm/subscriber/event/InsertEvent";
import { Product } from "../entity/Product";
import { ItemSale } from "../entity/ItemSale";

@EventSubscriber()
export class SaleSubscriber implements EntitySubscriberInterface<ItemSale> {


    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo() {
        return ItemSale;
    }

    /**
     * Called before post insertion.
     */
    
     async afterInsert(event: InsertEvent<ItemSale>) {
        const productRepository = AppDataSource.getRepository(Product);

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

    async afterRemove(event: RemoveEvent<ItemSale>) {
        const productRepository = AppDataSource.getRepository(Product);

        try {
            let product = await productRepository.findOneOrFail({ where: { id: Number(event.entity.productId) } });
                     
            product.stock = product.stock + event.entity.quantity;
            productRepository.save(product);
        } catch (error) {
            console.log("Error al actualizar el stock", error);
        }
        
    }

}