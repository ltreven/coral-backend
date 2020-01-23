provider "aws" {
    region = "eu-west-1"
}

resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"

  tags = {
    Name = "coral-vpc"
  }
}

resource "aws_subnet" "subnet-pub1" {
  vpc_id     = "${aws_vpc.main.id}"
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-west-1a"

  tags = {
    Name = "pub-e1a"
  }
}
resource "aws_subnet" "subnet-priv2" {
  vpc_id     = "${aws_vpc.main.id}"
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-west-1a"

  tags = {
    Name = "priv-e1a"
  }
}

resource "aws_internet_gateway" "coral-ig" {
  vpc_id = "${aws_vpc.main.id}"

  tags = {
    Name = "coral-ig"
  }
}

resource "aws_route_table" "ig-rt" {
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.coral-ig.id}"
  }

  tags = {
    Name = "ig-rt"
  }
}

resource "aws_route_table_association" "assoc1" {
  subnet_id      = "${aws_subnet.subnet-pub1.id}"
  route_table_id = "${aws_route_table.ig-rt.id}"
}

resource "aws_eip" "eip-1" {
  tags = {
    Name = "eip-1"
  }
}

resource "aws_nat_gateway" "nat-e1a" {
  allocation_id = "${aws_eip.eip-1.id}"
  subnet_id     = "${aws_subnet.subnet-pub1.id}"
  tags = {
    Name = "nat-e1a"
  }
}

resource "aws_route_table" "rt-nat1" {
  vpc_id = "${aws_vpc.main.id}"

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.nat-e1a.id}"
  }

  tags = {
    Name = "rt-nat1"
  }
}

resource "aws_route_table_association" "assoc-nat-e1a" {
  subnet_id      = "${aws_subnet.subnet-priv2.id}"
  route_table_id = "${aws_route_table.rt-nat1.id}"
}

variable "server_port" {
    description = "Server port to be used"
    type = number
    default = 3000
}

output "public_ip" {
    value = aws_instance.coral-backend.public_ip
    description = "The public IP"
}

resource "aws_instance" "coral-backend" {
    ami = "ami-02df9ea15c1778c9c"
    instance_type = "t2.micro"
    subnet_id   = "${aws_subnet.subnet-pub1.id}"
    associate_public_ip_address = true

    vpc_security_group_ids = [aws_security_group.coral-backend-sg.id]
    tags = {
        Name = "coral-backend"
    }
    user_data = <<-EOF
        #!/bin/bash
        sudo apt-get -y update
        sudo apt install git
        sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
        sudo apt-get install -y nodejs
        sudo git clone https://github.com/ltreven/coral-backend.git
        cd coral-backend
        sudo npm install
        npm start
        EOF
}

resource "aws_security_group" "coral-backend-sg" {
    name = "coral-backend-sg"
    description = "Allow TCP in and ALL out"
    vpc_id      = "${aws_vpc.main.id}"

    ingress {
        from_port = var.server_port
        to_port = var.server_port
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port       = 0
        to_port         = 0
        protocol        = "-1"
        cidr_blocks     = ["0.0.0.0/0"]
  }

}
