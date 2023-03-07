class Starship {
  constructor(name, type, photonTorpedoes, phaserBanks, shieldGenerators) {
    this.name = name;
    this.type = type;
    this.photonTorpedoes = photonTorpedoes;
    this.phaserBanks = phaserBanks;
    this.shieldGenerators = shieldGenerators;
    this.shieldHealth = {
      bow: 140,
      stern: 140,
      port: 140,
      starboard: 140,
    };
    this.isDestroyed = false;
  }

  fireWeapons(target) {
    if (this.isDestroyed) {
      return;
    }

    const isFederationShip = this.type === 'Federation';
    const torpedoEnergy = isFederationShip ? 150 : 100;
    const phaserEnergy = isFederationShip ? 100 : 60;

    // Fire photon torpedoes
    if (this.photonTorpedoes > 0) {
      target.takeDamage(torpedoEnergy);
      this.photonTorpedoes--;
      console.log(`${this.name} fires a photon torpedo at ${target.name}`);
      if (target.isDestroyed) {
        console.log(`${target.name} is destroyed!`);
        return;
      }
    }

    // Fire phaser banks
    if (this.phaserBanks > 0) {
      target.takeDamage(phaserEnergy);
      this.phaserBanks--;
      console.log(`${this.name} fires phasers at ${target.name}`);
      if (target.isDestroyed) {
        console.log(`${target.name} is destroyed!`);
        return;
      }
    }

    console.log(`${this.name} has no weapons left to fire.`);
  }

  takeDamage(damage) {
    const shieldKeys = Object.keys(this.shieldHealth);
    const randomShieldIndex = Math.floor(Math.random() * shieldKeys.length);
    const randomShield = shieldKeys[randomShieldIndex];

    this.shieldHealth[randomShield] -= damage;
    console.log(`${this.name}'s ${randomShield} shield takes ${damage} damage`);

    if (this.shieldHealth[randomShield] <= 0) {
      console.log(`${this.name}'s ${randomShield} shield has collapsed!`);
      this.shieldGenerators--;
      if (this.shieldGenerators <= 0) {
        console.log(`${this.name}'s shields are down and it is destroyed!`);
        this.isDestroyed = true;
        return;
      }
      console.log(`${this.name}'s shield generators require repairs.`);
      const repairTime = Math.floor(Math.random() * 11 + 10);
      console.log(`${this.name}'s shield generators will take ${repairTime} minutes to repair.`);
      setTimeout(() => {
        console.log(`${this.name}'s shield generators are repaired!`);
        this.shieldHealth = {
          bow: 140,
          stern: 140,
          port: 140,
          starboard: 140,
        };
      }, repairTime * 60 * 1000);
    }
  }
}

class Simulation {
  constructor(numFederationShips, numRomulanShips) {
    this.federationShips = [];
    this.romulanShips = [];
    this.turn = 1;
    this.isRunning = false;

    for (let i = 1; i <= numFederationShips; i++) {
      this.federationShips.push(
        new Starship(`Federation Ship ${i}`, 'Federation', 30, 12, 4)
      );
    }

    for (let i = 1; i <= numRomulanShips; i++) {
      this.romulanShips.push(
        new Starship(`Romulan Ship ${i}`, 'Romulan', 50, 12, 4)
      );
    }
  }

  start() {
    if (this.isRunning) {
      console.log('Simulation is already running.');
      return;
    }
    console.log('Starting simulation...');
    this.isRunning = true;

    while (this.federationShips.length > 0 && this.romulanShips.length > 0) {
      console.log(`Turn ${this.turn}:`);
      const randomFederationIndex = Math.floor(Math.random() * this.federationShips.length);
      const randomRomulanIndex = Math.floor(Math.random() * this.romulanShips.length);
      const federationShip = this.federationShips[randomFederationIndex];
      const romulanShip = this.romulanShips[randomRomulanIndex];
      federationShip.fireWeapons(romulanShip);
      romulanShip.fireWeapons(federationShip);
      if (federationShip.isDestroyed) {
        this.federationShips.splice(randomFederationIndex, 1);
      }
      if (romulanShip.isDestroyed) {
        this.romulanShips.splice(randomRomulanIndex, 1);
      }
      this.turn++;
    }

    if (this.federationShips.length === 0) {
      console.log('Romulans win!');
    } else {
      console.log('Federation wins!');
    }

    this.isRunning = false;
  }
}

const simulation = new Simulation(40, 40);
simulation.start();
