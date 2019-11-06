import {Entity} from './Entity';
import { Bullet } from './Bullet';

export class Player extends Entity {
    //player consturtor needs an Id
    //player needs health 
    //player needs spawn position x and y

    constructor(id, x = 250, y =250){
        super(id, x, y);
        this.health = 100;

        //Gun variables 


        //The ammount of ammo a mag can hold
        this.magSize = 3;
        //The ammount of ammo person currently has in their magazine
        this.ammoInMag = 1;
        //total ammo the person has
        this.ammo = 180;

        //reloading variables
        this.reloadTime = 1000;
        this.reloading = false


        //fire rate of the gun
        this.fireRate = 250;

        this.isShot = false;
        

        //variable used in ischanged function to know if the player moved
        this.preMovement = {
            x : this.x,
            y : this.y,
            angle : this.angle
        }
      
        //Add the player to the player list automatically
        //Player.list is initialized down below
        Player.list[this.id] = this;
        console.log(Object.keys(Player.list).length);
        
    }

    //updates the movement
    // it recieves the controls key and angle from the mouse movement as the parameters
    update(movement, angle, click, cells){

        //check the cells for collision
        const restrict = this.restriction(cells);

        //console.log(restrict.up);
        //console.log(restrict.right);
        //console.log(restrict.down);        
        //console.log(restrict.left);

        //updates the position if any key is pressed
        if(movement.pressingRight){
            this.x += (this.speed * restrict.right);
        } else if (movement.pressingUp){
            this.y -= (this.speed * restrict.up);
        } else if (movement.pressingLeft){
            this.x -= (this.speed * restrict.left);
        } else if (movement.pressingDown){
            this.y += (this.speed * restrict.down);
        } 
        

        //checks if there is a click and also within the fireRate
        if(click && !this.isShot){
            this.shoot();
        }


        //assigns the angle of mouse movement to the angle of the player
        this.angle = angle;

        //this.shoot(click);

    }


    //restricts the movement according to the collision
    restriction(cells){

        let up = 1;
        let right = 1;
        let down = 1;
        let left = 1;

        for(let i = 0; i < cells.length; i++){
            const cell = cells[i];

            if(cell.occupied)
            {

                if(i == 0 || i == 1)
                {
                    up = 0;
                }else if(i == 2 || i==3)
                {
                    right = 0;
                }else if(i==4|| i==5)
                {
                    down = 0;
                }else if(i == 6 || i == 7)
                {
                    left = 0;
                }
            }
        }

        return {
            up: up,
            right: right,
            down: down,
            left: left
        }

    }


    
    //reloading function
    reload(){

        this.reloading = true;
        setTimeout( () => {

            if(this.ammo >= (this.magSize - this.ammoInMag))
            {
                this.ammo -= this.magSize - this.ammoInMag;
                this.ammoInMag = this.magSize;
            } else {
                this.ammoInMag += this.ammo;
                this.ammo = 0;
            }

            this.reloading = false;

        }, this.reloadTime);
        
    }

    shoot(){

        this.isShot = true;

        setTimeout(() => {

            //shoots if there is ammo in the magazine
            if(this.ammoInMag > 0)
            {
                const bullet = new Bullet(Math.random(),this.x,this.y);
                bullet.angle=this.angle;
    
                //Reduce the ammo in mag 
                this.ammoInMag -= 1;
            } else {
                //if not then reloads
                if(!this.reloading){
                    this.reload();
                }
            }

            this.isShot = false;

        }, (60/this.fireRate) * 1000 );

    }

    //returns true if the player moved or looked
    isChanged()
    {
        let changed = false;

        if(this.preMovement.x = this.x)
        {
            changed = true;
        }else if (this.preMovement.y = this.y)
        {
            changed = true;
        }else if (this.preMovement.angle = this.angle){
            changed = true;
        }
        if(changed)
        {
            this.preMovement.x = this.x;
            this.preMovement.y = this.y;
            this.preMovement.angle = this.angle
        }
        return changed;

    }

    //write the function
    //iterate through all the players
    //
}




//This is a global list that lists all the instance of Player class.
//So basically all the players in the server
//This wil only be useful when there is server side implementation
Player.list={};
