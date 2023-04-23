import { execSync } from 'child_process';

export class SoftEther {
  public constructor() {}
  public async createVirtualAdapter(adapterName: string): Promise<void> {
    try {
      // Create a new virtual network adapter
      execSync(`vpncmd /Client localhost /CMD NicCreate VPN${adapterName}`, {
        stdio: 'ignore',
        windowsHide: true,
      });
      console.log(
        `Virtual adapter ${adapterName}Virtual created successfully.`
      );
    } catch (err) {
      console.error(`Failed to create virtual adapter ${adapterName}:`, err);
    }
  }

  public async deleteVirtualAdapter(adapterName: string): Promise<void> {
    try {
      // Delete a virtual network adapter
      execSync(`vpncmd /Client localhost /CMD NicDelete VPN${adapterName}`, {
        stdio: 'ignore',
        windowsHide: true,
      });
    } catch (err) {
      console.error(`Failed to create virtual adapter ${adapterName}:`, err);
    }
  }
  public async enableVirtualAdapter(adapterName: string): Promise<void> {
    try {
      // Enable the adapter
      execSync(`vpncmd /Client localhost /CMD NiceEnable VPN${adapterName}`, {
        stdio: 'ignore',
        windowsHide: true,
      });
    } catch (err) {
      console.error(`Failed to enable virtual adapter ${adapterName}:`, err);
    }
  }
  public async disableVirtualAdapter(adapterName: string): Promise<void> {
    try {
      // Disable the adapter
      execSync(`vpncmd /Client localhost /CMD NiceDisable VPN${adapterName}`, {
        stdio: 'ignore',
        windowsHide: true,
      });
    } catch (err) {
      console.error(`Failed to disable virtual adapter ${adapterName}:`, err);
    }
  }
  public async connectToVPN(
    serverAdress: string,
    port: string,
    username: string,
    password: string
  ): Promise<void> {
    try {
      // Disable the adapter
      execSync(
        `vpncmd ${serverAdress}:${port} /SERVER /CMD /INSECURE /USERNAME:${username} /PASSWORD:${password} `,
        {
          stdio: 'ignore',
          windowsHide: true,
        }
      );
    } catch (err) {
      console.error(`Failed to connect:`, err);
    }
  }

  public async disconnectFromVPN(): Promise<void> {
    try {
      // Disable the adapter
      execSync(`vpncmd /Client localhost /CMD Disconnect`, {
        stdio: 'ignore',
        windowsHide: true,
      });
    } catch (err) {
      console.error(`Failed to disconnect:`, err);
    }
  }
}
