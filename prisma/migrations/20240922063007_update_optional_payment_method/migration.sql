-- AlterTable
ALTER TABLE `order` MODIFY `payment_method` ENUM('CARD', 'PROMPTPAY') NULL;
