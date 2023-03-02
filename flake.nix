{
  description = "Statically generated site";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      # modify these as needed if you're using a different system
      systems = [ "x86_64-linux" "aarch64-darwin" ];
      perSystem = { config, inputs', pkgs, system, ... }: {
        devShells.default = import ./shell.nix { inherit pkgs; };
        packages.default = pkgs.callPackage ./site.nix {};
      };
    };
}