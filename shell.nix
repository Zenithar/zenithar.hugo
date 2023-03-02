{ pkgs ? import <nixpkgs> }:
pkgs.mkShell {
  buildInputs = [
    # build your static site with one of these
    pkgs.hugo
  ];
}